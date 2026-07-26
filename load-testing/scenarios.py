# Load Testing Scenarios & Helper Configuration

SCENARIOS = {
    "peak_carnival_rush": {
        "concurrent_participants": 1200,
        "hatch_rate": 50,
        "run_time": "15m",
        "target_endpoints": [
            "/api/treasury/credit",
            "/api/magefficie/purchase",
            "/api/leaderboard",
            "/api/auction/bid"
        ]
    },
    "registration_close_trigger": {
        "admin_users": 2,
        "registrations": 1042,
        "expected_domain_seeds": 17
    }
}
