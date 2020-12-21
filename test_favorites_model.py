import os
from unittest import TestCase

from models import db, User, Favorites
from sqlalchemy.exc import IntegrityError

os.environ['DATABASE_URL'] = "postgresql:///stock_market-test"
from app import app

db.drop_all()
db.create_all()

class FavoritesModelTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Favorites.query.delete()

        self.client = app.test_client()
    
    def tearDown(self):
        """Clean up residuals"""
        db.session.rollback()
    
    def test_Favorites_model(self):
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
        f=Favorites(stock='test_stock',user_id=1)
        db.session.add(f)
        db.session.commit()
        self.assertEqual(f.user_id,1)
        self.assertEqual(f.stock,'test_stock')
        self.assertEqual(f.users.username,"testuser")

