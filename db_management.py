from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Create all of the tables in the database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    news = db.relationship('News', backref='author', lazy=True)
    forms = db.relationship('AdoptionForm', backref='user', lazy=True)
    volunteer_request = db.relationship('VolunteerRequest', backref='user', lazy=True)
    transport = db.relationship('CatTransport', backref='user', lazy=True)

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(250), nullable=False, unique=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Cat(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(25), nullable=False)
	bio = db.Column(db.String(100), nullable=False)
	age = db.Column(db.Integer, nullable=False)
	gender = db.Column(db.String(1), nullable=False)
	image = db.Column(db.String(100))
	room = db.Column(db.String(2))
	adopted = db.Column(db.Boolean, nullable=False, default=False)
	forms = db.relationship('AdoptionForm', backref='cat', lazy=True)
	transport = db.relationship('CatTransport', backref='cat', lazy=True, uselist=False)

class CatTransport(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	stage = db.Column(db.String(15), nullable=False)
	cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), unique=True, nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class AdoptionForm(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	address = db.Column(db.String(30), nullable=False)
	other_pets = db.Column(db.Integer, nullable=False)
	reason = db.Column(db.String(100), nullable=False)
	cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	review = db.relationship('AdoptionFormReview', backref='form', uselist=False)

class AdoptionFormReview(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	status = db.Column(db.String(30), nullable=False)
	reason = db.Column(db.String(30))
	form_id = db.Column(db.Integer, db.ForeignKey('adoption_form.id'), unique=True, nullable=False)

class VolunteerStory(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(20), nullable=False)
	story = db.Column(db.String(400), nullable=False)

class VolunteerRequest(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(50), nullable=False)
	last_name = db.Column(db.String(50), nullable=False)
	address = db.Column(db.String(50), nullable=False)
	age = db.Column(db.Integer, nullable=False)
	reason = db.Column(db.String(500), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	review = db.relationship('VolunteerRequestReview', backref='request', uselist=False)

class VolunteerRequestReview(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	status = db.Column(db.String(30), nullable=False)
	reason = db.Column(db.String(30))
	request_id = db.Column(db.Integer, db.ForeignKey('volunteer_request.id'), unique=True, nullable=False)
