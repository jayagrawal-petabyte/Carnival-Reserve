// Universal 5-Step Money Action Engine

import { verifyManagerDevice } from '../../auth-service/src/device-guard';

export interface DomainCreditParams {
  idempotencyKey: string;
  managerId: string;
  deviceFingerprint: string;
  participantId: string;
  domainName: string;
  isWinner: boolean;
  proofPhotoUrl?: string; // Required if isWinner === true
}

export interface MagefficiePurchaseParams {
  idempotencyKey: string;
  managerId: string;
  deviceFingerprint: string;
  participantId: string;
  itemId: string;
  proofPhotoUrl: string; // Mandatory for Magefficie purchase
}

export interface AuctionBidParams {
  idempotencyKey: string;
  participantId: string;
  itemId: string;
  bidAmount: number;
}

export class TransactionEngine {
  constructor(private prisma: any, private redisPublisher?: any) {}

  /**
   * UNIVERSAL ACTION PATTERN: Domain Credit Route (Participation & Winner)
   * 1. Authenticate manager & device (max 2 approved)
   * 2. Validate domain claim & winner slots server-side on DomainTreasury
   * 3. Execute atomic Prisma $transaction
   * 4. Record Transaction row with idempotency key
   * 5. Real-time Notification
   */
  async processDomainCredit(params: DomainCreditParams) {
    const { idempotencyKey, managerId, deviceFingerprint, participantId, domainName, isWinner, proofPhotoUrl } = params;

    // STEP 1: AUTHENTICATE
    const deviceCheck = await verifyManagerDevice(this.prisma, managerId, deviceFingerprint);
    if (!deviceCheck.allowed) {
      throw new Error(`AUTH_DEVICE_FAILED: ${deviceCheck.reason}`);
    }

    if (isWinner && (!proofPhotoUrl || proofPhotoUrl.trim() === '')) {
      throw new Error('VALIDATION_FAILED: Winner credits require a photo proof URL.');
    }

    // Check existing Idempotency Key before starting transaction
    const existingTx = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });
    if (existingTx) {
      return { status: 'DUPLICATE_REJECTED', transaction: existingTx };
    }

    // STEP 2 & 3 & 4: VALIDATE, EXECUTE, AND RECORD ATOMICALLY IN $TRANSACTION
    const creditAmount = isWinner ? 250 : 50;
    const txType = isWinner ? 'WINNER_CREDIT' : 'PARTICIPATION_CREDIT';

    const result = await this.prisma.$transaction(async (tx: any) => {
      // 1. Fetch Participant & Passport with lock
      const participant = await tx.participant.findUnique({
        where: { id: participantId },
        include: { wallet: true, passport: { include: { stamps: true } } },
      });

      if (!participant || !participant.wallet) {
        throw new Error('VALIDATION_FAILED: Participant or wallet not found');
      }

      // Check if domain is already claimed by participant
      const existingStamp = participant.passport?.stamps.find((s: any) => s.domainName === domainName);
      if (existingStamp && !isWinner) {
        throw new Error(`VALIDATION_FAILED: Domain '${domainName}' has already been claimed by this participant.`);
      }

      // 2. Fetch Domain Treasury server-side counter record
      const treasury = await tx.domainTreasury.findUnique({
        where: { domainName },
      });

      if (!treasury) {
        throw new Error(`VALIDATION_FAILED: Domain Treasury '${domainName}' does not exist.`);
      }

      if (isWinner) {
        if (treasury.winnerSlotsRemaining <= 0) {
          throw new Error(`VALIDATION_FAILED: All 16 winner slots for domain '${domainName}' have been exhausted.`);
        }
      } else {
        if (treasury.participationRemaining <= 0) {
          throw new Error(`VALIDATION_FAILED: Participation pool for domain '${domainName}' has been exhausted.`);
        }
      }

      if (treasury.balance < creditAmount) {
        throw new Error(`VALIDATION_FAILED: Insufficient domain treasury balance in '${domainName}'.`);
      }

      // 3. ATOMIC UPDATES: Debit Domain Treasury & Credit Participant Wallet
      const updatedTreasury = await tx.domainTreasury.update({
        where: { id: treasury.id },
        data: {
          balance: { decrement: creditAmount },
          participationRemaining: isWinner ? treasury.participationRemaining : { decrement: 1 },
          winnerSlotsRemaining: isWinner ? { decrement: 1 } : treasury.winnerSlotsRemaining,
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { id: participant.wallet.id },
        data: {
          balance: { increment: creditAmount },
          totalEarned: { increment: creditAmount },
        },
      });

      // 4. Update or create Passport Stamp
      if (existingStamp) {
        await tx.passportStamp.update({
          where: { id: existingStamp.id },
          data: { isWinner: true },
        });
      } else {
        await tx.passportStamp.create({
          data: {
            passportId: participant.passport.id,
            domainName,
            isWinner,
          },
        });
      }

      // 5. Record Transaction Row
      const transactionRecord = await tx.transaction.create({
        data: {
          idempotencyKey,
          amount: creditAmount,
          type: txType,
          fromAccountId: treasury.id,
          toAccountId: participant.wallet.id,
          participantId: participant.id,
          managerId,
          proofPhotoUrl: isWinner ? proofPhotoUrl : null, // Save storage: plain participation needs timestamp only
        },
      });

      return {
        transaction: transactionRecord,
        newBalance: updatedWallet.balance,
        domainName,
        isWinner,
      };
    });

    // STEP 5: NOTIFY REAL-TIME CLIENT
    if (this.redisPublisher) {
      await this.redisPublisher.publish(
        'WALLET_UPDATE',
        JSON.stringify({
          participantId,
          balance: result.newBalance,
          domainName,
          isWinner,
          type: txType,
          timestamp: new Date().toISOString(),
        })
      );
    }

    return { status: 'SUCCESS', ...result };
  }

  /**
   * UNIVERSAL ACTION PATTERN: Magefficie Marketplace Purchase Route
   */
  async processMagefficiePurchase(params: MagefficiePurchaseParams) {
    const { idempotencyKey, managerId, deviceFingerprint, participantId, itemId, proofPhotoUrl } = params;

    // STEP 1: AUTHENTICATE
    const deviceCheck = await verifyManagerDevice(this.prisma, managerId, deviceFingerprint);
    if (!deviceCheck.allowed) {
      throw new Error(`AUTH_DEVICE_FAILED: ${deviceCheck.reason}`);
    }

    if (!proofPhotoUrl || proofPhotoUrl.trim() === '') {
      throw new Error('VALIDATION_FAILED: Magefficie purchases require proof photo URL.');
    }

    // Check Idempotency Key
    const existingTx = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });
    if (existingTx) {
      return { status: 'DUPLICATE_REJECTED', transaction: existingTx };
    }

    // STEP 2 & 3 & 4: ATOMIC TRANSACTION
    const result = await this.prisma.$transaction(async (tx: any) => {
      // Fetch Item
      const item = await tx.inventoryItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new Error('VALIDATION_FAILED: Inventory item not found.');
      }

      if (item.tier === 4) {
        throw new Error('VALIDATION_FAILED: Tier 4 items are reserved for auction only.');
      }

      if (item.availableCount <= 0) {
        throw new Error(`VALIDATION_FAILED: Item '${item.name}' is out of stock.`);
      }

      // Fetch Participant Wallet
      const participant = await tx.participant.findUnique({
        where: { id: participantId },
        include: { wallet: true },
      });

      if (!participant || !participant.wallet) {
        throw new Error('VALIDATION_FAILED: Participant wallet not found.');
      }

      if (participant.wallet.balance < item.price) {
        throw new Error(`VALIDATION_FAILED: Insufficient wallet balance (${participant.wallet.balance} Crn) for item price (${item.price} Crn).`);
      }

      // Debit Wallet & Update Inventory (Opening - Sold = Available)
      const updatedWallet = await tx.wallet.update({
        where: { id: participant.wallet.id },
        data: {
          balance: { decrement: item.price },
          totalSpent: { increment: item.price },
        },
      });

      const updatedItem = await tx.inventoryItem.update({
        where: { id: item.id },
        data: {
          availableCount: { decrement: 1 },
          soldCount: { increment: 1 },
        },
      });

      // Record Transaction
      const transactionRecord = await tx.transaction.create({
        data: {
          idempotencyKey,
          amount: item.price,
          type: 'MAGEFFICIE_PURCHASE',
          fromAccountId: participant.wallet.id,
          toAccountId: `MAGEFFICIE_ITEM_${item.id}`,
          participantId: participant.id,
          managerId,
          proofPhotoUrl,
        },
      });

      return {
        transaction: transactionRecord,
        newBalance: updatedWallet.balance,
        itemName: item.name,
        itemTier: item.tier,
      };
    });

    // STEP 5: NOTIFY
    if (this.redisPublisher) {
      await this.redisPublisher.publish(
        'WALLET_UPDATE',
        JSON.stringify({
          participantId,
          balance: result.newBalance,
          type: 'MAGEFFICIE_PURCHASE',
          itemName: result.itemName,
          timestamp: new Date().toISOString(),
        })
      );
    }

    return { status: 'SUCCESS', ...result };
  }

  /**
   * TIER 4 AUCTION: Place Bid with Balance Hold
   */
  async placeAuctionBid(params: AuctionBidParams) {
    const { idempotencyKey, participantId, itemId, bidAmount } = params;

    return await this.prisma.$transaction(async (tx: any) => {
      const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
      if (!item || item.tier !== 4) {
        throw new Error('VALIDATION_FAILED: Item is not a valid Tier 4 auction item.');
      }

      if (bidAmount < item.price) {
        throw new Error(`VALIDATION_FAILED: Bid amount must be at least starting price of ${item.price} Crn.`);
      }

      // Check current highest bid
      const highestBid = await tx.auctionBid.findFirst({
        where: { itemId, status: 'ACTIVE' },
        orderBy: { bidAmount: 'desc' },
      });

      if (highestBid && bidAmount <= highestBid.bidAmount) {
        throw new Error(`VALIDATION_FAILED: Bid must exceed current highest bid of ${highestBid.bidAmount} Crn.`);
      }

      const participant = await tx.participant.findUnique({
        where: { id: participantId },
        include: { wallet: true },
      });

      if (!participant || participant.wallet.balance < bidAmount) {
        throw new Error('VALIDATION_FAILED: Insufficient balance for auction hold.');
      }

      // If existing highest bid exists, release hold (refund) for previous bidder
      if (highestBid) {
        await tx.auctionBid.update({
          where: { id: highestBid.id },
          data: { status: 'OUTBID' },
        });

        await tx.wallet.update({
          where: { participantId: highestBid.participantId },
          data: { balance: { increment: highestBid.bidAmount } },
        });
      }

      // Place hold on new bidder's wallet
      await tx.wallet.update({
        where: { id: participant.wallet.id },
        data: { balance: { decrement: bidAmount } },
      });

      const newBid = await tx.auctionBid.create({
        data: {
          itemId,
          participantId,
          bidAmount,
          status: 'ACTIVE',
        },
      });

      await tx.transaction.create({
        data: {
          idempotencyKey,
          amount: bidAmount,
          type: 'AUCTION_HOLD',
          fromAccountId: participant.wallet.id,
          toAccountId: `AUCTION_ITEM_${itemId}`,
          participantId,
        },
      });

      return { status: 'SUCCESS', bid: newBid };
    });
  }
}
