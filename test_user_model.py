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
        name=u.name
        self.assertEqual(len(u.favorites), 0)
        self.assertEqual(name,'test test_lastname')

    def test_create_user(self):
        """Does basic model work?"""

        u=User(
            username="testuser7",
            email="test1@test.com",
            password="HASHED_PASSWORD",
            firstname='test',
            lastname='test_lastname'
            )
        db.session.add(u)
        try:
            u1=User(
                username="testuser7",
                email="test2@test.com",
                password="HASHED_PASSWORD",
                firstname='test',
                lastname='test_lastname')
            db.session.add(u1)
            db.session.commit()
        except IntegrityError:
            y='choose another username'
        self.assertEqual(u.username,'testuser7')
        self.assertEqual(y,'choose another username')
    
    def test_authenticate_user(self):
        """Does basic model work?"""

        username="testuser"
        email="test@test.com"
        password="HASHED_PASSWORD"
        firstname='test'
        lastname='test_lastname'
        pwd=User.register(username,password)
        u1=User(username=username,email=email,password=pwd,firstname=firstname,lastname=lastname)
        db.session.add(u1)
        db.session.commit()
        u=User.authenticate('testuser',"HASHED_PASSWORD")
        u2=User.authenticate('testuser2',"HASHED_PASSWORD")
        u3=User.authenticate('testuser',"HASHED_PASSWORD1")
        self.assertEqual(u.username,'testuser')
        self.assertEqual(u2,False)
        self.assertEqual(u3,False)