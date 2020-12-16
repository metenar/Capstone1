
from flask import Flask, render_template,session,g,flash,redirect, url_for,jsonify
from flask.globals import request
import requests
from models import db, connect_db, User, Favorites



from forms import UserAddForm, LoginForm, ChangePasswordForm
from sqlalchemy.exc import IntegrityError

CURR_USER_KEY = "curr_user"
apikey='16e20ae424370441fbf7356a4e2857f1'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///stock_market_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY']='merhabamete'

connect_db(app)

@app.route('/')
def show_homepage():
    if g.user:
        return redirect("/index")
    return render_template('homepage.html')

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

@app.route('/index')
def show_index_page():
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    return render_template('index.html')

@app.route('/index',methods=['POST'])
def search_functionality():
    tick=request.form['tick']
    return redirect(f'/{tick}')

@app.route('/signup', methods=["GET", "POST"])
def signup():
    form = UserAddForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                email=form.email.data,               
                password=form.password.data)
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)

        do_login(user)

        return redirect("/index")

    else:
        return render_template('signup.html', form=form)

@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/index")

        flash("Invalid credentials.", 'danger')

    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    """Handle logout of user."""

    do_logout()
    flash("Goodbye!", "info")
    return redirect("/")

@app.route('/<tick>')
def stock_details(tick):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    favorites=Favorites.query.filter_by(user_id=g.user.id).all()
    y=[fav.stock if fav.stock==tick else '' for fav in favorites]
    return render_template('stock_details.html',data=tick, fav=y)

@app.route('/<tick>',methods=['POST'])
def search_functionality_on_stock(tick):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    tick=request.form['tick']
    return redirect(f'/{tick}')

@app.route('/users/add_fav/<tick>',methods=['POST'])
def add_fav_to_user(tick):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    favorite=Favorites(stock=tick,user_id=g.user.id)
    db.session.add(favorite)
    db.session.commit()
    return redirect(f'/{tick}')

@app.route('/users/remove_fav/<tick>',methods=['POST'])
def remove_fav_from_user(tick):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    favorite=Favorites.query.filter_by(stock=tick).first()
    db.session.delete(favorite)
    db.session.commit()
    return redirect(f'/{tick}')

@app.route('/users/<int:id>')
def show_user_detail(id):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    user=User.query.get_or_404(id)
    return render_template('user_details.html',user=user)