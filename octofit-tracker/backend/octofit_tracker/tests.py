from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Team, User

class APIRootTest(APITestCase):
    def test_api_root(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)

class UserTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(name='Test User', email='test@example.com', team=self.team)

    def test_list_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_user(self):
        url = reverse('user-list')
        data = {'name': 'Another User', 'email': 'another@example.com', 'team_id': str(self.team.id)}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
