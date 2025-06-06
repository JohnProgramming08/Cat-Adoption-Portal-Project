from flask import Flask, render_template, redirect, url_for, jsonify
from forms import LoginForm, UsernameForm, NewsForm, CatForm, AdoptForm
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = "Kitty Cat"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    news = db.relationship('News', backref='author', lazy=True)
    forms = db.relationship('AdoptionForm', backref='user', lazy=True)

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(250), nullable=False, unique=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Cat(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(25), nullable=False)
	bio = db.Column(db.String(100), nullable=False)
	gender = db.Column(db.String(1), nullable=False)
	image = db.Column(db.String(100))
	forms = db.relationship('AdoptionForm', backref='cat', lazy=True)

class AdoptionForm(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	address = db.Column(db.String(30), nullable=False)
	other_pets = db.Column(db.Integer, nullable=False)
	reason = db.Column(db.Integer, nullable=False)
	cat_id = db.Column(db.Integer, db.ForeignKey('cat.id'), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


@app.route('/', methods=["GET", "POST"])
def index():
	form = LoginForm()
	# Log in and sign up functionality
	if form.validate_on_submit():
		username = form.username.data
		password = form.password.data
		found_username = User.query.filter(User.username==username).first()
		found_user = User.query.filter(User.username==username, User.password==password).first()
		# Successful
		if form.sign_up.data and not found_username:
			user = User(username=username, password=password, level="admin")
			db.session.add(user)
			db.session.commit()
			id = user.id
			return redirect(url_for('home', id=id))
		elif form.login.data and found_user:
			id = found_user.id
			return redirect(url_for('home', id=id))
		
		# Unsuccessful
		elif form.login.data:
			return render_template('index.html', form=form, attempt="wrong-details")
		elif form.sign_up.data:
			return render_template('index.html', form=form, attempt="existing-username")
		return redirect(url_for('index'))
	return render_template('index.html', form=form, attempt="none")


@app.route('/home/<int:id>', methods=["GET", "POST"])
def home(id):
	# Account details
	user = User.query.filter(User.id==id).first()
	form = UsernameForm()
	newest_news = News.query.order_by(News.id.desc()).first()
	if form.validate_on_submit():
		username = form.username.data
		found_user = User.query.filter(User.username==username).first()
		if found_user and username != user.username:
			form.username.data = user.username
			return render_template("home.html", user=user, form=form, error="exists", news=newest_news)
		else:
			user.username = username
			db.session.commit()
			return redirect(url_for("home", id=user.id))

	else:
		form.username.data = user.username
		return render_template("home.html", user=user, form=form, error="none", news=newest_news)


@app.route('/news/<int:id>', methods=["GET", "POST"])
def news(id):
	user = User.query.filter(User.id==id).first()
	news = News.query.all()
	form = NewsForm()
	if form.validate_on_submit():
		headline = form.headline.data
		description = form.description.data
		news_id = form.id.data
		found_news = News.query.filter(News.id==news_id).first()
		existing_headline = News.query.filter(News.headline==headline).first()
		existing_description = News.query.filter(News.description==description).first()

		if found_news and not existing_description and not existing_headline: # EDITING NEWS
			found_news.headline = headline
			found_news.description = description
			found_news.author_id = id
			db.session.commit()
		elif not existing_description and not existing_headline:
			new_news = News(headline=headline, description=description, author_id=id)
			db.session.add(new_news)
			db.session.commit()
		else:
			return render_template("news.html", user=user, form=form, news=news, error="exists")

		return redirect(url_for("news", id=id))
			

	return render_template("news.html", user=user, form=form, news=news, error="none")


@app.route('/get_news/<int:id>')
def get_news(id):
	news = News.query.filter(News.id==id).first()
	news_dict = {
		"id": news.id,
		"headline": news.headline,
		"description": news.description,
		"author": news.author_id
	}
	return jsonify(news_dict)


@app.route('/delete_news/<int:id>')
def delete_news(id):
	news = News.query.filter(News.id==id).first()
	db.session.delete(news)
	db.session.commit()
	return "Deleted"


@app.route('/cats/<int:id>', methods=["GET", "POST"])
def cats(id):
	user = User.query.get(id)
	form = AdoptForm()
	cats = Cat.query.all()
	if form.validate_on_submit():
		cat_id = form.cat_id.data
		address = form.address.data
		other_pets = form.other_pets.data
		reason = form.reason.data
		adoption_form = AdoptionForm(address=address, other_pets=other_pets, reason=reason, cat_id=cat_id, user_id=id)
		db.session.add(adoption_form)
		db.session.commit()
	return render_template("cats.html", user=user, cats=cats, form=form)


@app.route('/new_cat/<int:id>')
def new_cat(id):
	form = CatForm()
	user = User.query.get(id)
	if form.validate_on_submit():
		name = form.name.data
		bio = form.bio.data
		gender = form.gender.data
		image = form.image.data
		filename = secure_filename(image.filename)
		image.save(os.path.join('static/images', filename))
		cat = Cat(name=name, bio=bio, gender=gender, image=f'{filename}')
		db.session.add(cat)
		db.session.commit()
		return redirect(url_for('cats', id=id))
	return render_template("new_cat.html", form=form, user=user)

if __name__ == "__main__":
	app.run(debug=True, port=5000)

# MAKE IT SO ADMINS CAN VIEW ADOPTION FORMS