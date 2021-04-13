from models import Likes, User, Post
from main import app,db

import os
from werkzeug.utils import secure_filename
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask import request, jsonify, make_response, send_file, render_template

from models import User
from main import app,db

def token_required(func):
	@wraps(func)
	def decorated(*args, **kwargs):
		token = None
		# print('Header is',request.headers)
		if 'x-acess-token' in request.headers:
			token = request.headers['x-acess-token']
		if not token:
			return jsonify({'msg':'Token missing!'}),401
		#print('Token is ',token)
		try:
			data = jwt.decode(token, key='secret',algorithms='HS256')
			#print(data)
			current_user = User.query.filter_by(public_id=data['public_id']).first()
		except:
			return make_response("Invalid Token",401)
		return func(current_user, *args,**kwargs)
	return decorated


@app.route("/user", methods=['POST'])
def create_user():
	data = request.form
	#print('Received data is ',data)
	hashed_password	= generate_password_hash(data['password'], method='sha256')
	
	user = User.query.filter_by(username=data['username']).first()
	if user: return make_response('Username already taken',500)
	user = User.query.filter_by(email=data['email']).first()
	if user: return make_response('Email already used',500)
	
	public_id=str(uuid.uuid4())

	#get profile pic
	if 'file' in request.files:
		file = request.files['file']
		ext = file.filename.split('.')[1]
		filename = secure_filename(public_id+'.'+ext)
		file.save(os.path.join(app.config['UPLOAD_FOLDER']+'/dp', filename))
		file.close()
	else:
		filename = 'default.png'
		
	#print(data)
	new_user = User(
		public_id=public_id,
		username=data['username'],
		first_name=data['first_name'],
		last_name=data['last_name'],
		password=hashed_password,
		email=data['email'],
		#bio = data['bio'],
		dp = filename
		)
	db.session.add(new_user)
	db.session.commit()
	
	return jsonify({'msg':'New User Created'})

@app.route("/user", methods=['DELETE'])
@token_required
def delete_user(current_user):
	if current_user.dp !='default.png':
		os.remove(os.path.join(app.config['UPLOAD_FOLDER']+'/dp',current_user.dp))
	posts = Post.query.filter_by(user_pid=current_user.public_id).all()
	for post in posts:
		if post.image:
			os.remove(os.path.join(app.config['UPLOAD_FOLDER']+'/posts',post.image))
	
	db.session.delete(current_user)
	db.session.commit()

	return jsonify({'msg':'User Deleted.'})
	
@app.route("/login")
def login():
	auth = request.authorization
	#print('Auth header: ',auth)
	key = 'secret'
	alg = 'HS256'
	if not auth or not auth.username or not auth.password:
		return make_response('Could not verify',401,{'Www-Authenticate':'Basic realm="Login required!"'})
		#return jsonify({'msg':'Credentials missing.'})
	
	user = User.query.filter_by(username=auth.username).first()
	if not user:
		return make_response("User doesn't exist",404)

	if check_password_hash(user.password,auth.password):
		data = {
			'public_id':user.public_id,'exp':datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}
		token = jwt.encode(data, key, alg)

		return jsonify({'token':token})

	return make_response('Incorrect Login credentials',401)

@app.route('/user', methods=['GET'])
@token_required
def load_user(current_user):
	return jsonify({'username':current_user.username,'public_id':current_user.public_id,'dp':current_user.dp,'email':current_user.email,'name':current_user.first_name+' '+current_user.last_name})

@app.route('/psw', methods=['PUT'])
@token_required
def changePsw(current_user):
	data = request.form
	if check_password_hash(current_user.password,data['password']):
		current_user.password = generate_password_hash(data['new_password'], method='sha256')
		db.session.commit()
		return jsonify({'msg':'Password Changed'})
	return make_response('Incorrect Password',401)

@app.route('/')
def home():
   return render_template('index.html')