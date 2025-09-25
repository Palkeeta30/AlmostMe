from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json

class AuthApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('api_signup')
        self.login_url = reverse('api_login')
        self.logout_url = reverse('api_logout')
        self.test_user = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'TestPass123!'
        }

    def test_signup_success(self):
        response = self.client.post(self.signup_url, data=json.dumps(self.test_user), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get('success'))

    def test_signup_existing_username(self):
        User.objects.create_user(**self.test_user)
        response = self.client.post(self.signup_url, data=json.dumps(self.test_user), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json().get('success'))

    def test_login_success(self):
        User.objects.create_user(**self.test_user)
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        response = self.client.post(self.login_url, data=json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get('success'))

    def test_login_invalid_credentials(self):
        login_data = {'username': 'wronguser', 'password': 'wrongpass'}
        response = self.client.post(self.login_url, data=json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.json().get('success'))

    def test_logout(self):
        User.objects.create_user(**self.test_user)
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        self.client.post(self.login_url, data=json.dumps(login_data), content_type='application/json')
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get('success'))
