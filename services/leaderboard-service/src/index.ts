// Leaderboard Service

import { maskRegNo } from '@carnival/utils';
import { LeaderboardEntry } from '@carnival/types';

/**
 * Leaderboard Service
 * Hard Constraint: Leaderboard shows rank and name only, never a raw balance,
 * for any participant other than the viewer's own.
 */
export async function getLeaderboard(
  prisma: any,
  viewerParticipantId: string,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  const wallets = await prisma.wallet.findMany({
    take: limit,
    orderBy: [{ balance: 'desc' }, { totalEarned: 'desc' }],
    include: {
      participant: {
        include: {
          user: true,
        },
      },
    },
  });

  return wallets.map((wallet: any, index: number) => {
    const isCurrentUser = wallet.participantId === viewerParticipantId;

    return {
      rank: index + 1,
      participantName: wallet.participant?.user?.name || 'Anonymous Participant',
      regNo: maskRegNo(wallet.participant?.regNo || ''),
      isCurrentUser,
      // PRIVACY HARD CONSTRAINT: Raw balance is exposed ONLY to the viewer for their own account
      balance: isCurrentUser ? wallet.balance : undefined,
    };
  });
}
