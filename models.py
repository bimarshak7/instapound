from main import db
from datetime import datetime

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_id = db.Column(db.String(40), unique=True)
	username = db.Column(db.String(50),unique=True,nullable=False)
	first_name = db.Column(db.String(50))
	last_name = db.Column(db.String(50))
	password = db.Column(db.String(77))
	email = db.Column(db.String(50),unique=True)
	dp = db.Column(db.String(100),default='cab_view.png')
	bio = db.Column(db.String(100),default='')
	post = db.relationship('Post', backref='user', lazy = True,cascade = "all,delete, delete-orphan")
	comments = db.relationship('Comments', backref='user', lazy = True,cascade="all,delete,delete-orphan")
	likes = db.relationship('Likes', backref='user', lazy = True,cascade="all,delete,delete-orphan")

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_id = db.Column(db.String(40), unique=True)
	image = db.Column(db.String(100),nullable=True)
	caption = db.Column(db.String(100))
	#likes = db.Column(db.Integer,default=0)
	time = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)
	user_pid = db.Column(db.String(40), db.ForeignKey('user.public_id'))
	comments = db.relationship('Comments', backref='post', lazy = True,cascade = "all,delete,delete-orphan")
	likes = db.relationship('Likes', backref='post', lazy = True,cascade = "all,delete,delete-orphan")

class Comments(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	public_id = db.Column(db.String(40), unique=True)
	text = db.Column(db.String(100))
	time = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)
	user_id = db.Column(db.String(40),db.ForeignKey('user.public_id'), nullable=False)
	post_id = db.Column(db.String(40),db.ForeignKey('post.public_id'), nullable=False)

class Friendship(db.Model):
	user_a = db.Column(db.String(40), primary_key=True, nullable =False)
	user_b = db.Column(db.String(40), primary_key=True, nullable =False)
	status = db.Column(db.Integer)
	action_user = db.Column(db.String(40), nullable =False)

class Likes(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	post_id = db.Column(db.String(40),db.ForeignKey('post.public_id'), nullable=False)
	user_id = db.Column(db.String(40),db.ForeignKey('user.public_id'), nullable=False)
	#status = db.Column(db.Boolean,default=False)