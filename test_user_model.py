"""User model tests."""

import os
from unittest import TestCase

from models import db, User, Favorites
from sqlalchemy.exc import IntegrityError


os.environ['DATABASE_URL'] = "postgresql:///stock_market-test"
from app import app

db.drop_all()
db.create_all()

class UserModelTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Favorites.query.delete()

        self.client = app.test_client()

    def tearDown(self):
        """Clean up residuals"""
        db.session.rollback()

    def test_user_model(self):
        """Does basic model work?"""

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD",
            firstname='test',
            lastname='test_lastname'
        )

        db.session.add(u)
        db.session.commit()

        self.assertEqual(len(u.favorites), 0)

    # def test_create_user(self):
    #     """Does basic model work?"""

    #     u=User.signup("testuser7","test1@test.com","HASHED_PASSWORD",'https://randomuser.me/24.jpg')
    #     try:
    #         u1=User.signup("testuser7","test2@test.com","HASHED_PASSWORD",'https://randomuser.me/24.jpg')
    #         db.session.commit()
    #     except IntegrityError:
    #         y='choose another username'
    #     self.assertEqual(u.username,'testuser7')
    #     self.assertEqual(y,'choose another username')