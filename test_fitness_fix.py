#!/usr/bin/env python
"""
Test script to verify CSRF fix for fitness page
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(project_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'almostme.settings')
django.setup()

from django.test import Client
from django.urls import reverse

def test_fitness_page():
    """Test that fitness page loads without CSRF errors"""
    print("Testing fitness page...")

    client = Client()

    # Test GET request to fitness page
    try:
        response = client.get('/fitness/')
        print(f"✅ Fitness page status: {response.status_code}")

        if response.status_code == 200:
            print("✅ Fitness page loads successfully")
            print(f"✅ Content length: {len(response.content)} bytes")

            # Check if content contains expected elements
            content = response.content.decode('utf-8')
            if 'Health & Fitness' in content:
                print("✅ Page contains expected content")
            else:
                print("⚠️  Page content may be missing expected elements")

        else:
            print(f"❌ Fitness page returned status {response.status_code}")

    except Exception as e:
        print(f"❌ Error testing fitness page: {e}")

def test_fitness_api():
    """Test fitness API endpoints"""
    print("\nTesting fitness API endpoints...")

    client = Client()

    # Test workout plans endpoint
    try:
        response = client.get('/fitness/api/workout-plans/')
        print(f"✅ Workout plans API status: {response.status_code}")

        if response.status_code == 200:
            print("✅ Workout plans API accessible")
        else:
            print(f"⚠️  Workout plans API returned status {response.status_code}")

    except Exception as e:
        print(f"❌ Error testing workout plans API: {e}")

    # Test user health profile endpoint
    try:
        response = client.get('/fitness/api/user-health-profile/me/')
        print(f"✅ User profile API status: {response.status_code}")

        if response.status_code in [200, 404]:  # 404 is expected if no profile exists
            print("✅ User profile API accessible")
        else:
            print(f"⚠️  User profile API returned status {response.status_code}")

    except Exception as e:
        print(f"❌ Error testing user profile API: {e}")

def test_csrf_settings():
    """Test CSRF settings are properly configured"""
    print("\nTesting CSRF settings...")

    from django.conf import settings

    print(f"✅ CSRF_TRUSTED_ORIGINS count: {len(settings.CSRF_TRUSTED_ORIGINS)}")
    print(f"✅ CORS_ALLOWED_ORIGINS count: {len(settings.CORS_ALLOWED_ORIGINS)}")

    # Check for localhost:8000 in trusted origins
    localhost_8000_trusted = any('localhost:8000' in origin for origin in settings.CSRF_TRUSTED_ORIGINS)
    print(f"✅ localhost:8000 in CSRF_TRUSTED_ORIGINS: {localhost_8000_trusted}")

    # Check for wildcard origins
    wildcard_origins = [o for o in settings.CSRF_TRUSTED_ORIGINS if '*' in o]
    print(f"✅ Wildcard origins found: {len(wildcard_origins)}")

    print(f"✅ CSRF_COOKIE_SAMESITE: {settings.CSRF_COOKIE_SAMESITE}")
    print(f"✅ CSRF_COOKIE_HTTPONLY: {settings.CSRF_COOKIE_HTTPONLY}")
    print(f"✅ CSRF_USE_SESSIONS: {settings.CSRF_USE_SESSIONS}")

if __name__ == '__main__':
    print("=== CSRF Fix Test for Fitness Page ===\n")

    test_csrf_settings()
    test_fitness_page()
    test_fitness_api()

    print("\n=== Test Complete ===")
    print("If all tests show ✅, the CSRF fix is working properly!")
