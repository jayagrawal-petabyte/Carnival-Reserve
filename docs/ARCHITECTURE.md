# Carnival Reserve — Architecture & Design System

## Core Architectural Guarantees

### 1. Universal 5-Step Money Action Pattern
Every route moving currency follows this strict execution sequence:
1. **Authenticate**: Verifies manager identity and enforces maximum 2 approved devices per manager account. Adding a 3rd device requires Super Admin explicit approval.
2. **Validate**: Server-enforces domain participation stamp status and domain winner slot caps (`winnerSlotsRemaining <= 16`) directly on `DomainTreasury`.
3. **Execute**: Atomic database transaction (`$transaction`) updating balances and counters simultaneously to prevent read-then-write race conditions under high concurrency.
4. **Record**: Idempotency key recorded with a `UNIQUE` DB constraint. Photos stored for winner credits and marketplace purchases.
5. **Notify**: Real-time push via Socket.IO/Redis PubSub to the participant's client.

### 2. Idempotency & Reconnect Safety
- Every scan action is assigned a client-side v4 UUID `idempotencyKey`.
- Re-scans or network retries presenting an existing key are immediately rejected without reprocessing balance changes.
- Offline scans are persisted in IndexedDB and replayed in strict FIFO order upon reconnection.

### 3. Dynamic Economy Seeding Formula
Executed ONCE by Super Admin at registration close:
- $N$ = Confirmed registrations
- **Registration Pool**: $N \times 50 \text{ Crn}$
- **Participation Pool per domain**: $N \times 50 \text{ Crn}$ (Ceiling)
- **Winner Pool per domain**: $16 \times 250 = 4,000 \text{ Crn}$ max

### 4. Leaderboard & Privacy Guard
- Raw balances are hidden for all participants other than the viewer's own account.
- Registration numbers are masked for public display (e.g. `21BCE***`).
