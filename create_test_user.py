#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'almostme.settings')
django.setup()

from django.contrib.auth.models import User

def create_test_user():
    if User.objects.filter(username='testuser').exists():
        print("Test user already exists")
    else:
        user = User.objects.create_user('testuser', 'test@example.com', 'testpass123')
        print(f"Created test user: {user.username}")

if __name__ == '__main__':
    create_test_user()
