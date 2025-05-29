from flask import Flask, render_template, redirect, url_for, jsonify
from forms import LoginForm, UsernameForm, NewsForm
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = "Kitty Cat"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(50), nullable=False, unique=True)
	password = db.Column(db.String(50), nullable=False)
	level = db.Column(db.String(50), nullable=False)

class News(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	headline = db.Column(db.String(50), nullable=False, unique=True)
	description = db.Column(db.String(250), nullable=False, unique=True)
	author = db.Column(db.String(50), nullable=False)


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
			user = User(username=username, password=password, level="volunteer")
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
	user = User.query.filter(User.id==id).first()
	form = UsernameForm()
	if form.validate_on_submit():
		username = form.username.data
		found_user = User.query.filter(User.username==username).first()
		if found_user and username != user.username:
			form.username.data = user.username
			return render_template("home.html", user=user, form=form, error="exists")
		else:
			user.username = username
			db.session.commit()
			return redirect(url_for("home", id=user.id))

	else:
		form.username.data = user.username
		return render_template("home.html", user=user, form=form, error="none")


@app.route('/news/<int:id>', methods=["GET", "POST"])
def news(id):
	user = User.query.filter(User.id==id).first()
	news = News.query.all()
	form = NewsForm()
	if form.validate_on_submit():
		# DETECT IF NEWS ALREADY EXISTS
		found_news = News.query.filter
	return render_template("news.html", user=user, form=form, news=news)


@app.route('/get_news/<int:id>')
def get_news(id):
	news = News.query.filter(News.id==id).first()
	news_dict = {
		"id": news.id,
		"headline": news.headline,
		"description": news.description,
		"author": news.author
	}
	return jsonify(news_dict)



if __name__ == "__main__":
	app.run(debug=True, port=8000)