#!/usr/bin/env python
import requests
import json

# Test the fitness API endpoints
BASE_URL = "http://localhost:8000"

def test_csrf_token():
    """Test getting CSRF token"""
    try:
        response = requests.get(f"{BASE_URL}/auth-api/csrf/")
        print(f"CSRF Token: {response.status_code}")
        if response.status_code == 200:
            print("✓ CSRF token endpoint working")
        else:
            print("✗ CSRF token endpoint failed")
        return response.cookies.get('csrftoken')
    except Exception as e:
        print(f"✗ CSRF token request failed: {e}")
        return None

def test_user_profile_endpoint():
    """Test user profile endpoint (should require authentication)"""
    try:
        response = requests.get(f"{BASE_URL}/fitness/api/user-health-profile/me/")
        print(f"User Profile (unauthenticated): {response.status_code}")
        if response.status_code == 401:
            print("✓ User profile endpoint correctly requires authentication")
        else:
            print("✗ User profile endpoint authentication check failed")
    except Exception as e:
        print(f"✗ User profile request failed: {e}")

def test_auth_endpoints():
    """Test authentication endpoints"""
    try:
        # Test current user endpoint (should return not authenticated)
        response = requests.get(f"{BASE_URL}/auth-api/current_user/")
        print(f"Current User (unauthenticated): {response.status_code}")
        if response.status_code == 401:
            print("✓ Current user endpoint correctly returns 401 when not authenticated")
        else:
            print("✗ Current user endpoint authentication check failed")

        # Test login endpoint
        response = requests.post(f"{BASE_URL}/auth-api/login/", json={
            "username": "testuser",
            "password": "testpass"
        })
        print(f"Login (invalid credentials): {response.status_code}")
        if response.status_code == 401:
            print("✓ Login endpoint correctly rejects invalid credentials")
        else:
            print("✗ Login endpoint failed")

    except Exception as e:
        print(f"✗ Auth endpoints test failed: {e}")

if __name__ == "__main__":
    print("Testing AlmostMe API endpoints...")
    print("=" * 50)

    csrf_token = test_csrf_token()
    print()

    test_user_profile_endpoint()
    print()

    test_auth_endpoints()
    print()

    print("=" * 50)
    print("API tests completed!")
    print("\nNote: To test authenticated endpoints, you need to:")
    print("1. Create a test user: python create_test_user.py")
    print("2. Login through the frontend")
    print("3. Test the user profile update functionality")
