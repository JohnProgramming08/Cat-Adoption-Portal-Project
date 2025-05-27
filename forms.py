from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
	username = StringField("Username", render_kw={"placeholder": "Username"}, validators=[DataRequired()])
	password = PasswordField("Password", render_kw={"placeholder": "Password"}, validators=[DataRequired()])
	login = SubmitField("Log in")
	sign_up = SubmitField("Sign Up")

class UsernameForm(FlaskForm):
	username = StringField("Username: ", validators=[DataRequired()])
	save = SubmitField("Save")