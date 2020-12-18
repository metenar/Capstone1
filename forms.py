from flask.app import Flask
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, EqualTo, Length, InputRequired



class UserAddForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])
    firstname=StringField('First Name',validators=[InputRequired(),Length(min=3,max=30,message="Your First name too long/short")])
    lastname=StringField('Last Name',validators=[InputRequired(), Length(min=3,max=30,message="Your Last name too long/short")])
    image_file = FileField('Profile Picture', validators=[FileAllowed(['jpg', 'png'])])

class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

class ChangePasswordForm(FlaskForm):
    """Form for Password Change."""

    current_password=PasswordField('Current Password', validators=[Length(min=6)])
    new_password = PasswordField('New Password', validators=[Length(min=6),EqualTo('confirm_password', message='Passwords must match')])
    confirm_password = PasswordField('Confirm Password')

class UserEditForm(FlaskForm):
   """Form for User Edit.""" 
   username = StringField('Username', validators=[DataRequired()])
   email = StringField('E-mail', validators=[DataRequired()])
   firstname=StringField('First Name',validators=[InputRequired(),Length(min=3,max=30,message="Your First name too long/short")])
   lastname=StringField('Last Name',validators=[InputRequired(), Length(min=3,max=30,message="Your Last name too long/short")])
   image_file = FileField('Profile Picture', validators=[FileAllowed(['jpg', 'png'])])