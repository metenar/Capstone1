
from flask import Flask, render_template,session,g,flash,redirect, url_for,jsonify
from flask.globals import request
import os
import secrets
from PIL import Image
from models import db, connect_db, User, Favorites
from forms import UserAddForm, LoginForm, UserEditForm
from sqlalchemy.exc import IntegrityError

CURR_USER_KEY = "curr_user"
apikey='16e20ae424370441fbf7356a4e2857f1'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','postgresql:///stock_market_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY']=os.environ.get('SECRET_KEY','merhabamete')

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

def serialize(tick):
    return {'stock':tick}

def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn

@app.route('/index')
def show_index_page():
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    stocks=[fav.stock for fav in g.user.favorites]
    return render_template('index.html',favorites=stocks)

@app.route('/index',methods=['POST'])
def search_functionality():
    tick=request.form['tick']
    return redirect(f'/{tick}')

@app.route('/signup', methods=["GET", "POST"])
def signup():
    form = UserAddForm()
    if form.validate_on_submit():
        username=form.username.data
        email=form.email.data              
        password=form.password.data
        firstname=form.firstname.data
        lastname=form.lastname.data
        pwd=User.register(username,password)
        if form.image_file.data:
            picture_file = save_picture(form.image_file.data)
            image_file=picture_file
            new_user=User(username=username,password=pwd,email=email,
                        firstname=firstname,lastname=lastname,image_file=image_file)
        else:
            new_user=User(username=username,password=pwd,email=email,
                        firstname=firstname,lastname=lastname)
        db.session.add(new_user)    
        try:
            db.session.commit()
        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)
        do_login(new_user)
        flash('Welcome! Your Account Successfully Created!', "success")
        return redirect("/index")
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
    image_file = url_for('static', filename='profile_pics/' + user.image_file)
    return render_template('user_details.html',user=user,image_file=image_file)

@app.route('/users/<tick>/remove',methods=['GET','POST'])
def remove_fav_from_user_page(tick):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    favorite=Favorites.query.filter_by(stock=tick).first()
    db.session.delete(favorite)
    db.session.commit()
    return redirect(f'/users/{g.user.id}')

@app.route('/users/<int:id>/edit',methods=['GET','POST'])
def edit_user(id):
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    user=User.query.get_or_404(id)
    form=UserEditForm(obj=user)
    if form.validate_on_submit():
        user.username=form.username.data
        user.email=form.email.data
        user.image_file=form.image_file.data or User.image_file.default.arg
        user.firstname=form.firstname.data
        user.lastname=form.lastname.data
        db.session.commit()
        flash("Account Profile has been updated.", "info")
        return redirect(f'/users/{user.id}')
    return render_template('edit_user.html',form=form, user=user)

@app.route('/users/<int:id>/delete', methods=["POST"])
def delete_user(id):
    """Delete user."""
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    user=User.query.get_or_404(id)
    if user.id==g.user.id:
        db.session.delete(user)
        db.session.commit()
        do_logout()
        flash("Account deleted!",'success')
        return redirect('/')
    flash("You don't have permission to delete this account",'danger')
    return redirect(url_for('signup'))

@app.route('/users/favorites')
def user_favorites():
    favArray=[]
    user=User.query.get_or_404(g.user.id)
    favorites=user.favorites
    for fav in favorites:
        f=serialize(fav.stock)
        favArray.append(f)
    return (jsonify(favArray),200)

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('404.html'), 404

@app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req