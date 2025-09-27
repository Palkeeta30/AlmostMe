#!/usr/bin/env python
import requests
import json

# Test the fitness API endpoints with authentication
BASE_URL = "http://localhost:8000"

def test_login():
    """Test login and get session"""
    session = requests.Session()

    # Get CSRF token first
    csrf_response = session.get(f"{BASE_URL}/auth-api/csrf/")
    if csrf_response.status_code != 200:
        print("✗ Failed to get CSRF token")
        return None

    # Extract CSRF token from cookies
    csrf_token = csrf_response.cookies.get('csrftoken')
    if not csrf_token:
        print("✗ No CSRF token in cookies")
        return None

    # Login with test credentials
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }

    headers = {
        'X-CSRFToken': csrf_token,
        'Content-Type': 'application/json'
    }

    login_response = session.post(
        f"{BASE_URL}/auth-api/login/",
        json=login_data,
        headers=headers
    )

    if login_response.status_code == 200:
        login_data = login_response.json()
        if login_data.get('success'):
            print("✓ Login successful")
            return session
        else:
            print("✗ Login failed:", login_data.get('message'))
    else:
        print(f"✗ Login request failed with status {login_response.status_code}")

    return None

def test_user_profile_operations(session):
    """Test user profile operations"""
    if not session:
        print("✗ No session available for profile tests")
        return

    # Test getting user profile (should return 404 if not exists)
    profile_response = session.get(f"{BASE_URL}/fitness/api/user-health-profile/me/")
    print(f"Get User Profile: {profile_response.status_code}")

    if profile_response.status_code == 404:
        print("✓ Profile not found (expected for new user)")

        # Create a new profile
        profile_data = {
            "body_weight": 70.5,
            "height": 175.0,
            "age": 30,
            "goal": "muscle_gain",
            "injury": "",
            "is_pregnant": False
        }

        # Get CSRF token for POST request
        csrf_response = session.get(f"{BASE_URL}/auth-api/csrf/")
        csrf_token = csrf_response.cookies.get('csrftoken')

        headers = {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        }

        create_response = session.post(
            f"{BASE_URL}/fitness/api/user-health-profile/",
            json=profile_data,
            headers=headers
        )

        print(f"Create User Profile: {create_response.status_code}")
        if create_response.status_code == 201:
            print("✓ Profile created successfully")
            created_profile = create_response.json()
            profile_id = created_profile.get('id')
            print(f"✓ Created profile with ID: {profile_id}")

            # Now test getting the profile again
            profile_response = session.get(f"{BASE_URL}/fitness/api/user-health-profile/me/")
            print(f"Get User Profile (after creation): {profile_response.status_code}")
            if profile_response.status_code == 200:
                print("✓ Profile retrieved successfully")
                profile_data = profile_response.json()
                print(f"✓ Profile data: weight={profile_data.get('body_weight')}, height={profile_data.get('height')}")

                # Test updating the profile
                update_data = {
                    "body_weight": 72.0,
                    "height": 176.0,
                    "age": 31,
                    "goal": "fat_loss",
                    "injury": "knee pain",
                    "is_pregnant": False
                }

                update_response = session.put(
                    f"{BASE_URL}/fitness/api/user-health-profile/{profile_id}/",
                    json=update_data,
                    headers=headers
                )

                print(f"Update User Profile: {update_response.status_code}")
                if update_response.status_code == 200:
                    print("✓ Profile updated successfully")
                    updated_profile = update_response.json()
                    print(f"✓ Updated profile: weight={updated_profile.get('body_weight')}, goal={updated_profile.get('goal')}")
                else:
                    print(f"✗ Profile update failed: {update_response.text}")
            else:
                print(f"✗ Failed to retrieve profile after creation: {profile_response.text}")
        else:
            print(f"✗ Profile creation failed: {create_response.text}")

    elif profile_response.status_code == 200:
        print("✓ Profile already exists")
        profile_data = profile_response.json()
        print(f"✓ Existing profile: weight={profile_data.get('body_weight')}, height={profile_data.get('height')}")
    else:
        print(f"✗ Unexpected response: {profile_response.status_code} - {profile_response.text}")

def test_workout_operations(session):
    """Test workout operations"""
    if not session:
        print("✗ No session available for workout tests")
        return

    # Get CSRF token
    csrf_response = session.get(f"{BASE_URL}/auth-api/csrf/")
    csrf_token = csrf_response.cookies.get('csrftoken')

    headers = {
        'X-CSRFToken': csrf_token,
        'Content-Type': 'application/json'
    }

    # Test logging a workout
    workout_data = {
        "workout_type": "cardio",
        "duration": 45,
        "intensity": "moderate",
        "calories_burned": 300,
        "notes": "Morning run",
        "date": "2024-01-15"
    }

    log_response = session.post(
        f"{BASE_URL}/fitness/api/workouts/",
        json=workout_data,
        headers=headers
    )

    print(f"Log Workout: {log_response.status_code}")
    if log_response.status_code == 201:
        print("✓ Workout logged successfully")
        workout = log_response.json()
        print(f"✓ Workout: {workout.get('workout_type')} - {workout.get('duration')} min")

        # Test getting workout history
        history_response = session.get(f"{BASE_URL}/fitness/api/workouts/history/")
        print(f"Get Workout History: {history_response.status_code}")
        if history_response.status_code == 200:
            print("✓ Workout history retrieved successfully")
            workouts = history_response.json()
            print(f"✓ Found {len(workouts)} workouts")
        else:
            print(f"✗ Failed to get workout history: {history_response.text}")
    else:
        print(f"✗ Failed to log workout: {log_response.text}")

if __name__ == "__main__":
    print("Testing AlmostMe Fitness API with Authentication...")
    print("=" * 60)

    # Test login
    session = test_login()
    if session:
        print()

        # Test user profile operations
        test_user_profile_operations(session)
        print()

        # Test workout operations
        test_workout_operations(session)
        print()

        print("=" * 60)
        print("✓ All authenticated tests completed!")
    else:
        print("✗ Authentication failed - cannot proceed with authenticated tests")
