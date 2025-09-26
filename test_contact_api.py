#!/usr/bin/env python
import requests
import json

def test_contact_api():
    """Test the contact API endpoint"""
    url = "http://localhost:8000/contact/api/send/"
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message"
    }

    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing contact API endpoint...")
    success = test_contact_api()
    if success:
        print("✅ Contact API is working!")
    else:
        print("❌ Contact API is not working!")
