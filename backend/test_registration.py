# test_registration.py
import requests
import json

def test_registration():
    print("🧪 Testing User Registration API")
    print("=" * 50)
    
    # Test data
    test_user = {
        "email": "test_registration@example.com",
        "name": "Test Registration User",
        "password": "testpass123",
        "phone": "1234567890"
    }
    
    try:
        # Test registration endpoint
        print("📝 Testing registration...")
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

def test_all_endpoints():
    print("\n🔍 Testing all endpoints:")
    endpoints = [
        ("/", "Root"),
        ("/health", "Health"),
        ("/api/test", "Registration Test")
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}")
            print(f"✅ {name}: {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"❌ {name}: {e}")

if __name__ == "__main__":
    test_all_endpoints()
    test_registration()