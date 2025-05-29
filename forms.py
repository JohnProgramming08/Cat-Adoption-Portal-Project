from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, Length

class LoginForm(FlaskForm):
	username = StringField("Username", render_kw={"placeholder": "Username"}, validators=[DataRequired(), Length(max=50)])
	password = PasswordField("Password", render_kw={"placeholder": "Password"}, validators=[DataRequired(), Length(max=50)])
	login = SubmitField("Log in")
	sign_up = SubmitField("Sign Up")

class UsernameForm(FlaskForm):
	username = StringField("Username: ", validators=[DataRequired(), Length(max=50)])
	save = SubmitField("Save")

class NewsForm(FlaskForm):
	headline = StringField("Headline: ", validators=[DataRequired(), Length(max=50)])
	description = TextAreaField("Description: ", validators=[DataRequired(), Length(max=250)])
	id = IntegerField()
	submit = SubmitField("Submit")