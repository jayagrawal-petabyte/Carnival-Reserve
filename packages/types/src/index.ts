// Shared TypeScript Types for Carnival Reserve

export enum Role {
  PARTICIPANT = 'PARTICIPANT',
  TREASURY_MANAGER = 'TREASURY_MANAGER',
  MAGEFFICIE_MANAGER = 'MAGEFFICIE_MANAGER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TransactionType {
  REGISTRATION_SEED = 'REGISTRATION_SEED',
  PARTICIPATION_CREDIT = 'PARTICIPATION_CREDIT',
  WINNER_CREDIT = 'WINNER_CREDIT',
  MAGEFFICIE_PURCHASE = 'MAGEFFICIE_PURCHASE',
  AUCTION_HOLD = 'AUCTION_HOLD',
  AUCTION_SETTLE = 'AUCTION_SETTLE',
  AUCTION_REFUND = 'AUCTION_REFUND',
}

export interface UniversalTransactionDTO {
  idempotencyKey: string;
  participantId: string;
  managerId: string;
  deviceFingerprint: string;
  amount?: number; // Optional if determined by domain rules
  domainName?: string;
  isWinner?: boolean;
  itemId?: string;
  proofPhotoUrl?: string;
}

export interface WalletBalanceResponse {
  participantId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  updatedAt: string;
}

export interface PassportStatusResponse {
  participantId: string;
  stamps: {
    domainName: string;
    claimedAt: string;
    isWinner: boolean;
  }[];
}

export interface InventoryReconciliationReport {
  itemId: string;
  name: string;
  tier: number;
  openingCount: number;
  soldCount: number;
  availableCount: number;
  reservedCount: number;
  expectedAvailable: number;
  isReconciled: boolean;
  discrepancy: number;
}

export interface EconomySeedingSummary {
  confirmedParticipants: number;
  registrationPoolTotal: number;
  participationPoolPerDomain: number;
  winnerPoolPerDomain: number;
  domainsSeeded: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  participantName: string;
  regNo: string; // Partially masked for privacy, e.g. 21BCE***
  isCurrentUser: boolean;
  balance?: number; // Only exposed if isCurrentUser is true
}
