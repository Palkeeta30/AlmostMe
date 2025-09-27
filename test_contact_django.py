#!/usr/bin/env python
import os
import sys
import django
from django.test import Client
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'almostme.settings')
django.setup()

# Set testing flag for this test
from django.conf import settings
settings.TESTING = True

def test_contact_api():
    """Test the contact API endpoint using Django test client"""
    client = Client()

    data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message"
    }

    try:
        response = client.post('/contact/api/send/', data=data, content_type='application/json')
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.content.decode()}")

        if response.status_code == 200:
            print("✅ Contact API is working!")
            return True
        else:
            print("❌ Contact API returned error!")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing contact API endpoint with Django test client...")
    success = test_contact_api()
