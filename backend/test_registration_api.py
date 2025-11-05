# test_registration_api.py
import requests
import json

def test_registration():
    print("🧪 Testing Registration API")
    print("=" * 40)
    
    # Test data
    test_user = {
        "email": f"test_{requests.get('http://localhost:8000/health').json()['status']}@example.com",
        "name": "Test API User",
        "password": "testpass123",
        "phone": "1234567890"
    }
    
    try:
        # Test registration endpoint
        response = requests.post(
            "http://localhost:8000/api/register",
            json=test_user
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful!")
            print(f"Message: {data['message']}")
            print(f"User ID: {data['user_id']}")
        else:
            print(f"❌ Registration failed: {response.json()}")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")

def test_basic_endpoints():
    print("\n🔍 Testing basic endpoints:")
    endpoints = ["/", "/health", "/api/test"]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}")
            print(f"✅ {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: {e}")

if __name__ == "__main__":
    test_basic_endpoints()
    test_registration()