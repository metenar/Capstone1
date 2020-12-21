"""Favorites View tests."""

import os
from unittest import TestCase

from models import db, User, Favorites

os.environ['DATABASE_URL'] = "postgresql:///stock_market-test"

from app import app, CURR_USER_KEY

app.config['WTF_CSRF_ENABLED'] = False
app.config['TESTING']=True

class FavoritesViewTestCase(TestCase):
    """Test views for favorites."""

    def setUp(self):
        """Create test client, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()
        self.testuser=User(username='testuser',
                            email='test@test.com',
                            password=User.register('testuser','testuser'),
                            firstname='test',
                            lastname='test_lastname')
        db.session.add(self.testuser)
        db.session.commit()
    
    def tearDown(self):
        resp = super().tearDown()
        db.session.rollback()
        return resp
    
    def test_add_favorite(self):
        """Can add a favorite?"""

        with self.client as c:
            tick='test_stock'
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            resp = c.post(f"/users/add_fav/{tick}", data={"stock": f"{tick}",'user_id':f"{self.testuser.id}"})

            self.assertEqual(resp.status_code, 302)
            fav = Favorites.query.one()
            self.assertEqual(fav.stock, "test_stock")
    
    def test_remove_favorite(self):
        """Can remove a favorite?"""
        
        fav=Favorites(stock='test_stock',
            user_id=self.testuser.id)
        db.session.add(fav)
        db.session.commit()
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            resp = c.post("/users/remove_fav/test_stock",follow_redirects=True)
            self.assertEqual(resp.status_code, 200)
            f=Favorites.query.filter_by(stock='test_stock').first()
            self.assertIsNone(f)

