import logging
from fastapi.testclient import TestClient
from main import app

# Set up logging for test
logging.basicConfig(level=logging.INFO)

client = TestClient(app)

def run_test():
    print("Sending POST request to /send-report...")
    payload = {
        "email": "test@example.com",
        "name": "Test User",
        "report_title": "Automated Test Report",
        "ml_results": {
            "Status": "Passed",
            "Accuracy": 0.99
        }
    }
    response = client.post("/send-report", json=payload)
    print(f"Response Code: {response.status_code}")
    print(f"Response JSON: {response.json()}")

if __name__ == "__main__":
    run_test()
