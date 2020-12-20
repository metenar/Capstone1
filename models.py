from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref

bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)

class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )
    password = db.Column(
        db.Text,
        nullable=False,
    )

    firstname = db.Column(
        db.Text,
        nullable=False
    )
    lastname=db.Column(
        db.Text,
        nullable=False
    )
    image_file = db.Column(
        db.Text, 
        default='default.jpg')

    favorites = db.relationship(
        'Favorites',
        backref="users", cascade='all,delete-orphan'
    )

    @property
    def name(self):
        return f'{self.firstname} {self.lastname}'

    @classmethod
    def register(cls,username,pwd):
        """Registiration class method"""
        hashed=bcrypt.generate_password_hash(pwd)
        hashed_utf8=hashed.decode('utf8')
        return hashed_utf8
    
    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False
    
    @classmethod
    def reset_password(cls,username,password,new_password):
        user=User.authenticate(username,password)
        
        if user:
            hashed_pwd = bcrypt.generate_password_hash(new_password).decode('UTF-8')
            user.password=hashed_pwd

        return user
    
class Favorites(db.Model):
    """User in the system."""

    __tablename__ = 'favorites'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    stock = db.Column(
        db.Text,
        nullable=False,
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )