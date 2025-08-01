from db_management import (
    db,
    User,
    News,
    Cat,
    CatTransport,
    AdoptionForm,
    AdoptionFormReview,
    VolunteerStory,
    VolunteerRequest,
    VolunteerRequestReview,
)
from flask import Flask, render_template, redirect, url_for, jsonify
from forms import (
    LoginForm,
    UsernameForm,
    NewsForm,
    CatForm,
    AdoptForm,
    ReviewAdoptForm,
    VolunteerRequestForm,
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
import random

# Initial setup (boilerplate)
app = Flask(__name__)
app.secret_key = "Kitty Cat"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db.init_app(app)


# Initial sign up / log in page
@app.route("/", methods=["GET", "POST"])
def index():
    form = LoginForm()
    # Log in and sign up functionality
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        found_username = User.query.filter(User.username == username).first()
        found_user = User.query.filter(
            User.username == username, User.password == password
        ).first()
        # Successful signup
        if form.sign_up.data and not found_username:
            user = User(username=username, password=password, level="user")
            db.session.add(user)
            db.session.commit()
            id = user.id
            return redirect(url_for("home", id=id))
        # Successful login
        elif form.login.data and found_user:
            id = found_user.id
            return redirect(url_for("home", id=id))

        # Unsuccessful login / signup
        elif form.login.data:
            return render_template(
                "index.html", form=form, attempt="wrong-details"
            )
        elif form.sign_up.data:
            return render_template(
                "index.html", form=form, attempt="existing-username"
            )
        return redirect(url_for("index"))

    return render_template("index.html", form=form, attempt="none")


# Home page
@app.route("/home/<int:id>", methods=["GET", "POST"])
def home(id):
    # Get all info to be displayed to the user
    user = User.query.filter(User.id == id).first()
    form = UsernameForm()
    newest_news = News.query.order_by(News.id.desc()).first()
    user_adoptions = AdoptionForm.query.filter(AdoptionForm.user_id == id).all()
    transport_reviews = AdoptionFormReview.query.filter(
        AdoptionFormReview.status == "To be delivered",
    ).all()
    due_transports = []
    for review in transport_reviews:
        due_transports.append(review.form)
    user_applications = (
        VolunteerRequest.query.filter(VolunteerRequest.user_id == id)
        .order_by(VolunteerRequest.user_id.desc())
        .all()
    )

    if form.validate_on_submit():
        form_username = form.username.data
        found_user = User.query.filter(User.username == form_username).first()
        # Someone already has that username
        if found_user and form_username != user.username:
            form.username.data = user.username
            return render_template(
                "home.html",
                applications=user_applications,
                user=user,
                form=form,
                error="exists",
                news=newest_news,
                adoptions=user_adoptions,
                transports=due_transports,
            )
        # Successful username change
        else:
            user.username = form_username
            db.session.commit()
            return redirect(url_for("home", id=user.id))
    else:
        form.username.data = user.username
        return render_template(
            "home.html",
            applications=user_applications,
            user=user,
            form=form,
            error="none",
            news=newest_news,
            adoptions=user_adoptions,
            transports=due_transports,
        )


# News page
@app.route("/news/<int:id>", methods=["GET", "POST"])
def news(id):
    user = User.query.filter(User.id == id).first()
    news = News.query.all()
    form = NewsForm()
    # Create a new news article
    if form.validate_on_submit():
        # Get all of the news data
        headline = form.headline.data
        description = form.description.data
        news_id = form.id.data
        found_news = News.query.filter(News.id == news_id).first()
        existing_headline = News.query.filter(News.headline == headline).first()
        existing_description = News.query.filter(
            News.description == description
        ).first()

        # Edit an existing news article
        if found_news and not existing_description and not existing_headline:
            found_news.headline = headline
            found_news.description = description
            found_news.author_id = id
            db.session.commit()
        # Create a new news article
        elif not existing_description and not existing_headline:
            new_news = News(
                headline=headline, description=description, author_id=id
            )
            db.session.add(new_news)
            db.session.commit()
        # News article with the given headline already exists
        else:
            return render_template(
                "news.html", user=user, form=form, news=news, error="exists"
            )

        return redirect(url_for("news", id=id))
    return render_template(
        "news.html", user=user, form=form, news=news, error="none"
    )


# Return news info of the given news id
@app.route("/get_news/<int:id>")
def get_news(id):
    news = News.query.filter(News.id == id).first()
    news_dict = {
        "id": news.id,
        "headline": news.headline,
        "description": news.description,
        "author": news.author_id,
    }
    return jsonify(news_dict)


# Delete the news from the database with the given news id
@app.route("/delete_news/<int:id>")
def delete_news(id):
    news = News.query.filter(News.id == id).first()
    db.session.delete(news)
    db.session.commit()
    return "Deleted"


# Cats page
@app.route("/cats/<int:id>", methods=["GET", "POST"])
def cats(id):
    user = User.query.get(id)
    form = AdoptForm()
    cats = Cat.query.all()
    if form.validate_on_submit():
        cat_id = form.cat_id.data
        found_form = (
            AdoptionForm.query.filter(
                AdoptionForm.user_id == id, AdoptionForm.cat_id == cat_id
            )
            .order_by(AdoptionForm.id.desc())
            .first()
        )
        # Someone has submitted a form to adopt the cat before
        if found_form and not getattr(found_form, "review", None):
            return render_template(
                "cats.html", user=user, cats=cats, form=form, error="exists"
            )

        # Successful adoption form
        address = form.address.data
        other_pets = form.other_pets.data
        reason = form.reason.data
        adoption_form = AdoptionForm(
            address=address,
            other_pets=other_pets,
            reason=reason,
            cat_id=cat_id,
            user_id=id,
        )
        db.session.add(adoption_form)
        db.session.commit()
        return redirect(url_for("cats", id=id))
    return render_template(
        "cats.html", user=user, cats=cats, form=form, error="none"
    )


# Add a new cat to the database
@app.route("/new_cat/<int:id>")
def new_cat(id):
    form = CatForm()
    user = User.query.get(id)
    if form.validate_on_submit():
        # Get data from the form
        name = form.name.data
        bio = form.bio.data
        gender = form.gender.data
        room = form.room.data
        age = form.age.data
        image = form.image.data
        filename = secure_filename(image.filename)

        # Add the cat to the database and save the image
        image.save(os.path.join("static/images", filename))
        cat = Cat(
            name=name,
            bio=bio,
            gender=gender,
            room=room,
            age=age,
            image=f"{filename}",
        )
        db.session.add(cat)
        db.session.commit()
        return redirect(url_for("cats", id=id))
    return render_template("new_cat.html", form=form, user=user)


# Reject any other adoption forms for that cat
def reject_adoption_forms(forms, review_form):
    for form in forms:
        if form.id != review_form.form_id.data:
            form_review = AdoptionFormReview(
                status="Declined",
                reason="Cat has new parents.",
                form_id=form.id,
            )
            db.session.add(form_review)
    db.session.commit()


# Admin page
@app.route("/admin/<int:id>", methods=["GET", "POST"])
def admin(id):
    # Get all data needed for admin tasks
    review_form = ReviewAdoptForm()
    user = User.query.get(id)
    adoption_forms = AdoptionForm.query.all()
    volunteer_forms = VolunteerRequest.query.all()
    new_review = 0

    # Cat adoption form has been accepted
    if (
        review_form.validate_on_submit()
        and review_form.accept.data
        and review_form.type.data == "cat"
    ):
        new_review = AdoptionFormReview(
            status="To be delivered", form_id=review_form.form_id.data
        )
        cat = AdoptionForm.query.get(new_review.form_id).cat
        cat.adopted = True
        cat_adoption_forms = AdoptionForm.query.filter(
            AdoptionForm.cat_id == cat.id
        ).all()
        reject_adoption_forms(cat_adoption_forms, review_form)
    # Cat adoption form has been denied
    elif (
        review_form.validate_on_submit()
        and review_form.decline.data
        and review_form.type.data == "cat"
    ):
        new_review = AdoptionFormReview(
            status="Declined",
            reason=review_form.reason.data,
            form_id=review_form.form_id.data,
        )

    # Volunteer application form has been accepted
    elif (
        review_form.validate_on_submit()
        and review_form.accept.data
        and review_form.type.data == "volunteer"
    ):
        request = VolunteerRequest.query.get(review_form.form_id.data)
        request_user = User.query.get(request.user_id)
        request_user.level = "volunteer"
        new_review = VolunteerRequestReview(
            status="Accepted", request_id=review_form.form_id.data
        )
    # Volunteer application form has not been accepted
    elif (
        review_form.validate_on_submit()
        and review_form.decline.data
        and review_form.type.data == "volunteer"
    ):
        new_review = VolunteerRequestReview(
            status="Declined", request_id=review_form.form_id.data
        )
    if new_review:
        db.session.add(new_review)
        db.session.commit()
        return redirect(url_for("admin", id=id))

    return render_template(
        "admin.html",
        volunteer_forms=volunteer_forms,
        adoption_forms=adoption_forms,
        user=user,
        review_form=review_form,
    )


# Find the form of the given type using the given ID
@app.route("/find_form/<int:id>/<type>")
def find_form(id, type):
    if type == "cat":
        form = AdoptionForm.query.get(id)
        form_dict = {
            "id": form.id,
            "address": form.address,
            "other_pets": form.other_pets,
            "reason": form.reason,
            "cat_id": form.cat.id,
            "cat_name": form.cat.name,
            "cat_bio": form.cat.bio,
            "user_id": form.user.id,
            "username": form.user.username,
            "room": form.cat.room,
        }
    else:
        form = VolunteerRequest.query.get(id)
        form_dict = {
            "id": form.id,
            "address": form.address,
            "reason": form.reason,
            "user_id": form.user_id,
            "username": form.user.username,
            "first_name": form.first_name,
            "last_name": form.last_name,
            "age": form.age,
        }
    return jsonify(form_dict)


# Become volunteer page || user is not a volunteer
@app.route("/become_volunteer/<int:id>", methods=["GET", "POST"])
def become_volunteer(id):
    def save_data():
        first_name = form.first_name.data
        last_name = form.last_name.data
        address = form.address.data
        age = form.age.data
        reason = form.reason.data
        new_request = VolunteerRequest(
            first_name=first_name,
            last_name=last_name,
            address=address,
            age=age,
            reason=reason,
            user_id=id,
        )
        db.session.add(new_request)
        db.session.commit()

    # Choose a random volunteer story
    all_stories = VolunteerStory.query.all()
    num = random.randint(0, len(all_stories) - 1)
    story = all_stories[num]
    form = VolunteerRequestForm()
    found_request = VolunteerRequest.query.filter(
        VolunteerRequest.user_id == id
    ).first()

    user = User.query.get(id)
    # Successful submission of application
    if form.validate_on_submit() and not found_request:
        save_data()
        return render_template(
            "become_volunteer.html",
            user=user,
            volunteer=story,
            form=form,
            request=True,
            error="success",
        )
    elif form.validate_on_submit() and found_request.review:
        if found_request.review.status == "declined":
            save_data()
            return render_template(
                "become_volunteer.html",
                user=user,
                volunteer=story,
                form=form,
                request=True,
                error="success",
            )
    # Unsuccessful submission of application
    elif form.validate_on_submit() and found_request:
        return render_template(
            "become_volunteer.html",
            user=user,
            volunteer=story,
            form=form,
            request=False,
            error="exists",
        )
    return render_template(
        "become_volunteer.html",
        user=user,
        volunteer=story,
        form=form,
        request=False,
        error="none",
    )


# Is volunteer page || user is a volunteer or admin
@app.route("/is_volunteer/<int:id>/<int:clicked_id>")
def is_volunteer(id, clicked_id):
    user = User.query.get(id)
    adoption_reviews = AdoptionFormReview.query.filter(
        AdoptionFormReview.status != "Declined"
    ).all()
    clicked_form = AdoptionForm.query.get(clicked_id)

    for review in adoption_reviews:
        # If the user is currently transporting a cat
        if (
            review.form.cat.transport
            and review.status != "Cat Delivered"
            and review.form.cat.transport.user_id == id
        ):
            adoption_form_id = review.form.id
            cat_id = review.form.cat.id
            return render_template(
                "is_volunteer.html",
                user=user,
                reviews=adoption_reviews,
                user_transport="True",
                cat_id=cat_id,
                form_id=adoption_form_id,
                clicked_form=False,
            )
        # Someone else is currently transporting the cat
        elif review.form.cat.transport and review.status != "Cat Delivered":
            adoption_reviews.pop(adoption_reviews.index(review))

    return render_template(
        "is_volunteer.html",
        user=user,
        reviews=adoption_reviews,
        user_transport="False",
        cat_id=0,
        form_id=0,
        clicked_form=clicked_form,
    )


# Start a cat transport or continue a transport if one has been started
@app.route("/start_transport/<int:user_id>/<int:cat_id>")
def start_transport(user_id, cat_id):
    cat = Cat.query.get(cat_id)
    # Return the transport data
    if cat.transport:
        form = (
            db.session.query(AdoptionForm)
            .join(AdoptionFormReview)
            .filter(
                AdoptionForm.cat_id == cat.id,
                AdoptionFormReview.status != "Declined",
            )
            .first()
        )
        transport_id = cat.transport.id
        status = form.review.status
        stage = cat.transport.stage
        dict = {
            "transport": "exists",
            "stage": stage,
            "status": status,
            "id": transport_id,
        }
        return jsonify(dict)
    # Start a new transport
    else:
        cat_transport = CatTransport(
            stage="pickup", cat_id=cat_id, user_id=user_id
        )
        db.session.add(cat_transport)
        db.session.commit()
        transport_id = cat_transport.id
        dict = {"transport": False, "id": transport_id}
        return jsonify(dict)


# Progress a cat transport to the next stage
@app.route("/next_stage/<int:user_id>/<int:cat_id>")
def next_stage(cat_id, user_id):
    cat = Cat.query.get(cat_id)
    stages = ["pickup", "delivery", "confirm"]
    transport_stage = cat.transport.stage

    if transport_stage != "confirm":
        next_stage = stages[stages.index(transport_stage) + 1]
        cat.transport.stage = next_stage
        db.session.commit()
    return jsonify(reload=True)


# Return the data about a cat delivery
@app.route("/get_delivery/<int:id>")
def get_delivery(id):
    adoption_form = AdoptionForm.query.get(id)
    transport = adoption_form.cat.transport

    # If the cat is being transported
    if transport:
        user = User.query.get(transport.user_id)
        user_volunteer = (
            VolunteerRequest.query.filter(VolunteerRequest.user_id == user.id)
            .order_by(VolunteerRequest.id.desc())
            .first()
        )
        # User may be an admin not a volunteer
        try:
            first_name = user_volunteer.first_name
            last_name = user_volunteer.last_name
            full_name = f"{first_name} {last_name}"
        except:
            full_name = user.username
        transport_id = transport.id
        stage = transport.stage
        display = ""

        # Assign the display for the user based on the stage of transport
        if stage == "pickup":
            display = f"{full_name} is picking up your cat right now."
        elif stage == "delivery":
            display = f"{full_name} is on the way right now."
        else:
            display = f"{full_name} has just delivered your cat."

        # Return the transport data
        dict = {
            "id": transport_id,
            "transport": True,
            "name": full_name,
            "stage": stage,
            "display": display,
        }
        return jsonify(dict)
    return jsonify(transport=False)


# Confirm that a delivery has been completed
@app.route("/confirm_delivery/<int:transport_id>/<int:success>")
def confirm_delivery(transport_id, success):
    transport = CatTransport.query.get(transport_id)
    adoption_form_review = (
        db.session.query(AdoptionFormReview)
        .join(AdoptionForm)
        .filter(
            AdoptionForm.cat_id == transport.cat_id,
            AdoptionFormReview.status != "Declined",
        )
        .first()
    )

    if success:
        transport.stage = "completed_delivery"
        adoption_form_review.status = "Cat Delivered"
    else:
        adoption_form_review.status = "Unsuccessful: Being Delivered"
        transport.stage = "failed_delivery"

    db.session.commit()
    return jsonify(finished=True)


# Cancel a currently ongoing cat transport
@app.route("/cancel_transport/<int:transport_id>")
def cancel_transport(transport_id):
    transport = CatTransport.query.get(transport_id)
    adoption_form_review = (
        db.session.query(AdoptionFormReview)
        .join(AdoptionForm)
        .filter(AdoptionForm.cat_id == transport.cat_id)
        .order_by(AdoptionFormReview.id.desc())
        .first()
    )
    db.session.delete(transport)
    adoption_form_review.status = "To be delivered"
    db.session.commit()
    return jsonify(cancelled=True)


if __name__ == "__main__":
    app.run(debug=True, port=8000)

