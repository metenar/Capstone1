"""User View tests."""

import os
from unittest import TestCase

from models import db, User

os.environ['DATABASE_URL'] = "postgresql:///stock_market-test"

from app import app, CURR_USER_KEY

# db.create_all()

app.config['WTF_CSRF_ENABLED'] = False
app.config['TESTING']=True

class UsersViewTestCase(TestCase):
    """Test views for users."""

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

    def test_user_view(self):
        """Can view user details?"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            resp = c.get(f"/users/{self.testuser.id}")
            self.assertEqual(resp.status_code, 200)

            self.assertIn("test@test.com", str(resp.data))
    
    def test_delete_user(self):
        """Can delete a user?"""
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            resp = c.post(f"/users/{self.testuser.id}/delete",follow_redirects=True)
            self.assertEqual(resp.status_code, 200)
            u=User.query.get(self.testuser.id)
            self.assertIsNone(u)
    
    def test_invalid_user_id(self):
        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id
            resp = c.get("/users/7777777777")
            self.assertEqual(resp.status_code,404)

