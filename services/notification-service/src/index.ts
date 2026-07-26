// Notification Service (Real-time Socket.IO / Redis PubSub Gateway)

export class NotificationGateway {
  private rooms: Map<string, Set<any>> = new Map();

  constructor() {}

  /**
   * Register client socket to participant room
   */
  joinParticipantRoom(participantId: string, socket: any) {
    if (!this.rooms.has(participantId)) {
      this.rooms.set(participantId, new Set());
    }
    this.rooms.get(participantId)!.add(socket);
  }

  /**
   * Leave participant room
   */
  leaveParticipantRoom(participantId: string, socket: any) {
    if (this.rooms.has(participantId)) {
      this.rooms.get(participantId)!.delete(socket);
    }
  }

  /**
   * Broadcast wallet balance & passport update to participant clients
   */
  pushWalletUpdate(participantId: string, payload: { balance: number; type: string; domainName?: string; isWinner?: boolean }) {
    const sockets = this.rooms.get(participantId);
    if (sockets && sockets.size > 0) {
      const message = JSON.stringify({
        event: 'WALLET_UPDATE',
        participantId,
        data: payload,
        timestamp: new Date().toISOString(),
      });

      sockets.forEach((socket) => {
        try {
          socket.send(message);
        } catch (e) {
          console.error(`Failed to send socket notification to ${participantId}`, e);
        }
      });
    }
  }
}
