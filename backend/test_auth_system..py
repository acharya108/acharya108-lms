# backend/test_auth_system.py
import requests
import json

def test_auth_endpoints():
    print("🧪 Testing New Auth System")
    print("=" * 50)
    
    # Test user data
    test_user = {
        "email": "test_auth@example.com",
        "password": "securepassword123",
        "name": "Test Auth User",
        "phone": "1234567890"
    }
    
    try:
        # Test registration
        print("📝 Testing registration...")
        response = requests.post(
            "http://localhost:8000/api/auth/register",
            json=test_user,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("🎉 REGISTRATION SUCCESSFUL!")
            print(f"Message: {data['message']}")
            print(f"User ID: {data['user']['id']}")
            print(f"Email: {data['user']['email']}")
            
            # Test login
            print("\n🔐 Testing login...")
            login_data = {
                "email": test_user["email"],
                "password": test_user["password"]
            }
            
            login_response = requests.post(
                "http://localhost:8000/api/auth/login",
                json=login_data,
                timeout=10
            )
            
            print(f"Login Status: {login_response.status_code}")
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                print("🎉 LOGIN SUCCESSFUL!")
                print(f"Message: {login_data['message']}")
                print(f"User: {login_data['user']['email']}")
            else:
                print(f"❌ Login failed: {login_response.json()}")
                
        elif response.status_code == 400:
            print(f"⚠️ User already exists: {response.json()}")
        else:
            print(f"❌ Registration failed: {response.json()}")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")

def test_all_endpoints():
    print("\n🔍 Testing all endpoints:")
    endpoints = [
        ("/", "Root"),
        ("/health", "Health")
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}", timeout=5)
            print(f"✅ {name}: {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"❌ {name}: {e}")

if __name__ == "__main__":
    test_all_endpoints()
    test_auth_endpoints()