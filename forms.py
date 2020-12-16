from flask.app import Flask
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, EqualTo, Length



class UserAddForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

class ChangePasswordForm(FlaskForm):
    """Form for Password Change."""

    current_password=PasswordField('Current Password', validators=[Length(min=6)])
    new_password = PasswordField('New Password', validators=[Length(min=6),EqualTo('confirm_password', message='Passwords must match')])
    confirm_password = PasswordField('Confirm Password')