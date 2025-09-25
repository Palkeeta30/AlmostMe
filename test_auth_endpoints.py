#!/usr/bin/env python3
"""
Test script to verify authentication endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_signup():
    """Test user signup"""
    data = {
        "username": "testuser123",
        "email": "test@example.com",
        "password": "TestPass123!"
    }

    response = requests.post(
        f"{BASE_URL}/auth-api/signup/",
        json=data,
        headers={"Content-Type": "application/json"}
    )

    print(f"Signup Response: {response.status_code}")
    print(f"Response: {response.json()}")
    return response

def test_login():
    """Test user login"""
    data = {
        "username": "testuser123",
        "password": "TestPass123!"
    }

    response = requests.post(
        f"{BASE_URL}/auth-api/login/",
        json=data,
        headers={"Content-Type": "application/json"}
    )

    print(f"Login Response: {response.status_code}")
    print(f"Response: {response.json()}")
    return response

def test_current_user():
    """Test current user endpoint"""
    # Create a session to maintain cookies
    session = requests.Session()

    # First login
    login_data = {
        "username": "testuser123",
        "password": "TestPass123!"
    }

    login_response = session.post(
        f"{BASE_URL}/auth-api/login/",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )

    print(f"Login Response: {login_response.status_code}")
    print(f"Login Response: {login_response.json()}")

    # Then check current user
    user_response = session.get(f"{BASE_URL}/auth-api/current_user/")
    print(f"Current User Response: {user_response.status_code}")
    print(f"Current User Response: {user_response.json()}")

if __name__ == "__main__":
    print("Testing authentication endpoints...")

    print("\n1. Testing signup:")
    signup_response = test_signup()

    print("\n2. Testing login:")
    login_response = test_login()

    print("\n3. Testing current user:")
    test_current_user()

    print("\nTest completed!")
