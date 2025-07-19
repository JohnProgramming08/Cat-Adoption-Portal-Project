from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    PasswordField,
    SubmitField,
    TextAreaField,
    IntegerField,
    SelectField,
    FileField,
)
from wtforms.validators import DataRequired, Length, NumberRange


class LoginForm(FlaskForm):
    username = StringField(
        "Username",
        render_kw={"placeholder": "Username"},
        validators=[DataRequired(), Length(max=50)],
    )
    password = PasswordField(
        "Password",
        render_kw={"placeholder": "Password"},
        validators=[DataRequired(), Length(max=50)],
    )
    login = SubmitField("Log in")
    sign_up = SubmitField("Sign Up")


class UsernameForm(FlaskForm):
    username = StringField(
        "Username: ", validators=[DataRequired(), Length(max=50)]
    )
    save = SubmitField("Save")


class NewsForm(FlaskForm):
    headline = StringField(
        "Headline: ", validators=[DataRequired(), Length(max=50)]
    )
    description = TextAreaField(
        "Description: ", validators=[DataRequired(), Length(max=250)]
    )
    id = IntegerField()
    submit = SubmitField("Submit")


class CatForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=25)])
    bio = TextAreaField("Bio", validators=[DataRequired(), Length(max=100)])
    gender = SelectField(
        "Gender",
        choices=[("M", "Male"), ("F", "Female")],
        validators=[DataRequired()],
    )
    room = StringField(
        "Room Number", validators=[DataRequired(), Length(max=2)]
    )
    age = IntegerField("Age", validators=[DataRequired(), NumberRange(min=0)])
    image = FileField("Image")
    submit = SubmitField("Submit")


class AdoptForm(FlaskForm):
    cat_id = IntegerField(validators=[DataRequired()])
    address = StringField(
        "Address", validators=[DataRequired(), Length(max=30)]
    )
    other_pets = IntegerField(
        "How many other pets do you have?",
        validators=[DataRequired(), NumberRange(min=0)],
    )
    reason = TextAreaField(
        "Why do you want to adopt a cat?",
        validators=[DataRequired(), Length(max=100)],
    )
    submit = SubmitField("Submit")


class ReviewAdoptForm(FlaskForm):
    type = StringField(validators=[DataRequired()])
    form_id = IntegerField(validators=[DataRequired()])
    reason = TextAreaField(
        "Reason (only if declined):", validators=[Length(max=30)]
    )
    accept = SubmitField("Accept")
    decline = SubmitField("Decline")


class VolunteerRequestForm(FlaskForm):
    first_name = StringField(
        "First Name", validators=[DataRequired(), Length(max=50)]
    )
    last_name = StringField(
        "Last Name", validators=[DataRequired(), Length(max=50)]
    )
    address = StringField(
        "Address", validators=[DataRequired(), Length(max=50)]
    )
    age = IntegerField("Age", validators=[DataRequired(), NumberRange(min=0)])
    reason = TextAreaField(
        "Reason", validators=[DataRequired(), Length(max=500)]
    )
    submit = SubmitField("Submit")
