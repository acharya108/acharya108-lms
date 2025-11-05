# test_api.py
import requests
import json

# Test registration
response = requests.post(
    "http://localhost:8000/api/register",
    json={
        "email": "testapi@example.com",
        "name": "Test API User",
        "password": "testpass123",
        "phone": "1234567890"
    }
)

print("Status Code:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))