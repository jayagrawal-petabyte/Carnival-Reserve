# Carnival Reserve — API Specifications

## 1. Domain Treasury Credit Route
`POST /api/treasury/credit`

**Headers**:
- `Idempotency-Key`: `uuid-v4-string` (REQUIRED)
- `Authorization`: `Bearer <manager-jwt>`

**Payload**:
```json
{
  "idempotencyKey": "9f83a21e-84b2-4d3f-9a1b-123456789abc",
  "managerId": "mgr_coding_01",
  "deviceFingerprint": "fp_approved_device_1",
  "participantId": "part_1042",
  "domainName": "Coding & Algo",
  "isWinner": true,
  "proofPhotoUrl": "https://storage.carnival.edu/proofs/winner_1042.jpg"
}
```

**Response (200 OK)**:
```json
{
  "status": "SUCCESS",
  "newBalance": 300,
  "domainName": "Coding & Algo",
  "isWinner": true
}
```

---

## 2. Magefficie Marketplace Purchase Route
`POST /api/magefficie/purchase`

**Payload**:
```json
{
  "idempotencyKey": "8a72b11d-73a1-4c2e-8b0a-987654321def",
  "managerId": "mgr_magefficie_01",
  "deviceFingerprint": "fp_approved_vendor_1",
  "participantId": "part_1042",
  "itemId": "item_tier2_notebook",
  "proofPhotoUrl": "https://storage.carnival.edu/proofs/purchase_1042.jpg"
}
```

---

## 3. Tier 4 Auction Bid Route
`POST /api/auction/bid`

**Payload**:
```json
{
  "idempotencyKey": "7b61a00c-62z0-3b1d-7a9z-456789012ghi",
  "participantId": "part_1042",
  "itemId": "item_tier4_hoodie",
  "bidAmount": 3500
}
```

---

## 4. Admin Economy Seed Trigger Route
`POST /api/admin/economy/seed`

**Payload**:
```json
{
  "confirmedRegistrations": 1042
}
```
