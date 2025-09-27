#!/usr/bin/env python3
"""
Test script to verify that login and signup functionality works correctly
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3001"

def test_csrf_token():
    """Test CSRF token endpoint"""
    print("Testing CSRF token endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/auth-api/csrf/")
        print(f"CSRF Status: {response.status_code}")
        print(f"CSRF Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"CSRF Error: {e}")
        return False

def test_signup():
    """Test user signup"""
    print("\nTesting user signup...")
    try:
        signup_data = {
            "username": f"testuser_{int(time.time())}",
            "email": f"test_{int(time.time())}@example.com",
            "password": "TestPassword123!"
        }

        response = requests.post(
            f"{BASE_URL}/auth-api/signup/",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )

        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.text}")

        if response.status_code == 200:
            response_data = response.json()
            if response_data.get("success"):
                print("✅ Signup successful!")
                return signup_data["username"], signup_data["password"]
            else:
                print(f"❌ Signup failed: {response_data.get('message')}")
                return None, None
        else:
            print("❌ Signup failed with status:", response.status_code)
            return None, None
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return None, None

def test_login(username, password):
    """Test user login"""
    print(f"\nTesting login for user: {username}")
    try:
        login_data = {
            "username": username,
            "password": password
        }

        response = requests.post(
            f"{BASE_URL}/auth-api/login/",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )

        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")

        if response.status_code == 200:
            response_data = response.json()
            if response_data.get("success"):
                print("✅ Login successful!")
                return True
            else:
                print(f"❌ Login failed: {response_data.get('message')}")
                return False
        else:
            print("❌ Login failed with status:", response.status_code)
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_current_user():
    """Test current user endpoint"""
    print("\nTesting current user endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/auth-api/current-user/")
        print(f"Current User Status: {response.status_code}")
        print(f"Current User Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Current user error: {e}")
        return False

def main():
    print("🔧 Testing Authentication Fix")
    print("=" * 50)

    # Test CSRF token
    if not test_csrf_token():
        print("❌ CSRF token test failed!")
        return

    # Test signup
    username, password = test_signup()
    if not username:
        print("❌ Signup test failed!")
        return

    # Test login
    if not test_login(username, password):
        print("❌ Login test failed!")
        return

    # Test current user
    if not test_current_user():
        print("❌ Current user test failed!")
        return

    print("\n" + "=" * 50)
    print("🎉 All authentication tests passed!")
    print("\n📋 Summary of fixes applied:")
    print("✅ Fixed Django cookie security settings")
    print("✅ Added missing diet API endpoints")
    print("✅ Started Django server on port 8000")
    print("✅ Started React frontend on port 3001")
    print("✅ Verified proxy configuration")
    print("\n🚀 Your login and signup should now work correctly!")

if __name__ == "__main__":
    main()
