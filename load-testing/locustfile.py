import random
import uuid
from locust import HttpUser, task, between

class CarnivalParticipantUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Initialize participant session and idempotency headers"""
        self.participant_id = f"part_{uuid.uuid4().hex[:8]}"

    @task(3)
    def view_wallet_and_passport(self):
        """Query wallet balance and passport stamp status"""
        self.client.get(f"/api/wallet/{self.participant_id}", name="/api/wallet/[participantId]")

    @task(2)
    def view_leaderboard(self):
        """Fetch masked public leaderboard"""
        self.client.get(f"/api/leaderboard?viewer={self.participant_id}", name="/api/leaderboard")

    @task(1)
    def place_auction_bid(self):
        """Simulate Tier 4 end-of-day auction bid with idempotency guard"""
        headers = {
            "Idempotency-Key": str(uuid.uuid4()),
            "Content-Type": "application/json"
        }
        payload = {
            "participantId": self.participant_id,
            "itemId": "item_tier4_hoodie",
            "bidAmount": random.randint(3000, 5000)
        }
        self.client.post("/api/auction/bid", json=payload, headers=headers, name="/api/auction/bid")

class TreasuryManagerUser(HttpUser):
    wait_time = between(0.5, 1.5)

    def on_start(self):
        self.manager_id = "mgr_coding_01"
        self.device_fingerprint = "fp_approved_device_1"

    @task(5)
    def scan_and_credit_participation(self):
        """High-frequency domain participation credit scan"""
        idempotency_key = str(uuid.uuid4())
        headers = {
            "Idempotency-Key": idempotency_key,
            "Content-Type": "application/json"
        }
        payload = {
            "idempotencyKey": idempotency_key,
            "managerId": self.manager_id,
            "deviceFingerprint": self.device_fingerprint,
            "participantId": f"part_{random.randint(1000, 2200)}",
            "domainName": "Coding & Algo",
            "isWinner": False
        }
        self.client.post("/api/treasury/credit", json=payload, headers=headers, name="/api/treasury/credit [Participation]")

    @task(1)
    def scan_and_credit_winner(self):
        """Winner credit scan with photo proof requirement"""
        idempotency_key = str(uuid.uuid4())
        headers = {
            "Idempotency-Key": idempotency_key,
            "Content-Type": "application/json"
        }
        payload = {
            "idempotencyKey": idempotency_key,
            "managerId": self.manager_id,
            "deviceFingerprint": self.device_fingerprint,
            "participantId": f"part_{random.randint(1000, 2200)}",
            "domainName": "Coding & Algo",
            "isWinner": True,
            "proofPhotoUrl": "https://storage.carnival.edu/proofs/winner_1042.jpg"
        }
        self.client.post("/api/treasury/credit", json=payload, headers=headers, name="/api/treasury/credit [Winner]")
