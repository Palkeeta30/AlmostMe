#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'almostme.settings')
sys.path.append('.')
django.setup()

from contact.models import ContactMessage

def test_contact_messages():
    messages = ContactMessage.objects.all()
    print(f"Total contact messages: {messages.count()}")

    for msg in messages:
        print(f"ID: {msg.id}")
        print(f"Name: {msg.name}")
        print(f"Email: {msg.email}")
        print(f"Subject: {msg.subject}")
        print(f"Message: {msg.message[:50]}...")
        print(f"Created: {msg.created_at}")
        print("-" * 50)

if __name__ == "__main__":
    test_contact_messages()
