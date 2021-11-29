from models import Comments, Friendship, Post, User, Likes
from main import app,db

import os
from werkzeug.utils import secure_filename
import uuid
from flask import request, jsonify
import uuid
from routes.auth import token_required

@app.route("/post", methods=['POST'])
@token_required
def create_post(current_user):
	data = request.form
	public_id=str(uuid.uuid4())
	#get picture
	if 'file' in request.files:
		file = request.files['file']
		ext = file.filename.split('.')[1]
		filename = secure_filename(public_id+'.'+ext)
		file.save(os.path.join(app.config['UPLOAD_FOLDER']+'/posts', filename))
		file.close()
	else:
		filename= ''
	
	new_post = Post(
		public_id=public_id,
		image = filename,
		caption = data['caption'],
		user_pid = current_user.public_id
		)
	db.session.add(new_post)
	db.session.commit()
	
	return jsonify({'msg':'New Post Created','id':public_id})

@app.route("/post/<post_id>", methods=['GET'])
@token_required
def get_singlepost(current_user, post_id):
	#print('Post id is', post_id)
	post = Post.query.filter_by(public_id=post_id).first()
	if not post:
		return jsonify({'msg':'Post Not found'})

	friend = Post.query.filter_by(public_id=post_id).first().user_pid
	owner = User.query.filter_by(public_id=friend).first()
	cq = Comments.query.filter_by(post_id=post_id).all()
	
	comment = None if cq is None else {}
	if cq is not None:
		for i,cmt in enumerate(cq):
			cmtr = User.query.filter_by(public_id=cmt.user_id).first()
			c_likes = Likes.query.filter(Likes.post_id==cmt.public_id).count()
			c_ol = 1 if Likes.query.filter((Likes.post_id==cmt.public_id)&(Likes.user_id==current_user.public_id)).first() else 0
			comment[i] = {'id':cmt.public_id,'text':cmt.text,'time':cmt.time,'name':cmtr.first_name+' '+cmtr.last_name,'owner':cmtr.username,'dp':cmtr.dp,'likes':c_likes,'own_like':c_ol}

	query = Friendship.query.filter(((Friendship.user_a==current_user.public_id)&(Friendship.user_b==friend))|((Friendship.user_b==current_user.public_id)&(Friendship.user_a==friend))).first()
	
	if (query and query.status==1) or (owner.public_id==current_user.public_id):
		post_data={}
		like = Likes.query.filter((Likes.post_id==post_id)&(Likes.user_id==current_user.public_id)).first()
		post_data['comments'] = Comments.query.filter(Comments.post_id==post_id).count()
		post_data['own_like'] = 1 if like else 0
		post_data['likes'] = Likes.query.filter(Likes.post_id==post_id).count() 
			#print('No. of likes: ',likes)
		post_data['id']=post.public_id
		post_data['caption']=post.caption
		post_data['time']=post.time
		img = None if post.image =='' else post.image
		post_data['image']=img
		post_data['owner']=owner.username
		post_data['dp'] = '/static/uploads/dp/'+owner.dp
		post_data['name']=owner.first_name+' '+owner.last_name
		post_data['comment']=comment
		
		# print(post_data)
		return jsonify({'0':post_data})

	return jsonify({'msg':'Not available for you.'})


# Fetch posts to display on feed
@app.route("/posts", methods=['GET'])
@token_required
def get_posts(current_user):

	friend_query = Friendship.query.filter(((Friendship.user_a==current_user.public_id)|(Friendship.user_b==current_user.public_id))&(Friendship.status==1)).all()
	
	#Get list of friends of current user using list comprehension
	friends = [friend.user_b if friend.user_a==current_user.public_id else friend.user_a for friend in friend_query]	
	#print('Friends are',friends)
	post_query = Post.query.filter(Post.user_pid.in_(friends)).order_by(Post.time.desc()).all()
	
	posts={}
	for i,post in enumerate(post_query):
		like = Likes.query.filter((Likes.post_id==post.public_id)&(Likes.user_id==current_user.public_id)).first()
		own_like = 1 if like else 0
		likes = Likes.query.filter(Likes.post_id==post.public_id).count()
		comments = Comments.query.filter(Comments.post_id==post.public_id).count()
		user = User.query.filter_by(public_id=post.user_pid).first()
		img = None if post.image =='' else post.image 
		dp='/static/uploads/dp/'+user.dp
		comment=None
		qr= Comments.query.filter_by(post_id=post.public_id).order_by(Comments.time.desc()).first()
		if qr:
			cmtr = User.query.filter_by(public_id=qr.user_id).first()
			c_likes = Likes.query.filter(Likes.post_id==qr.public_id).count()
			c_ol = 1 if Likes.query.filter((Likes.post_id==qr.public_id)&(Likes.user_id==current_user.public_id)).first() else 0
			comment ={'id':qr.public_id,'text':qr.text,'time':qr.time,'name':cmtr.first_name+' '+cmtr.last_name,'dp':cmtr.dp,'owner':cmtr.username,'likes':c_likes,'own_like':c_ol}
			comment={'0':comment}
		posts[i]={'id':post.public_id,'owner':user.username,'name':user.first_name+' '+user.last_name,'dp':dp,'caption':post.caption,'image':img,'time':post.time,'own_like':own_like,'likes':likes,'comments':comments,'comment':comment}
	#print(posts[0]['time'])

	return jsonify(posts)

# Like or unlike posts
@app.route("/like/<post_id>", methods=['PUT'])
@token_required
def like_post(current_user, post_id):
	#print('Post id is', post_id)
	like = Likes.query.filter((Likes.post_id==post_id)&(Likes.user_id==current_user.public_id)).first()
	if like:
		#print('Before',like.status)
		#like.status= not like.status
		db.session.delete(like)
	else:
		like = Likes(
			user_id=current_user.public_id,
			post_id = post_id,
			#status = True
			)
		db.session.add(like)

	db.session.commit()
	#print('After',like.status)
	return jsonify({'msg':'Sucess'})

# Delete Post
@app.route("/post/<post_id>", methods=['DELETE'])
@token_required
def delete_post(current_user, post_id):
	post = Post.query.filter_by(public_id=post_id).first()
	if post:
		db.session.delete(post)
		db.session.commit()
		return jsonify({'msg':'Post Deleted.'})

	return jsonify({'msg':'Post Not Found.'})

# Delete Post
@app.route("/post/<post_id>", methods=['PUT'])
@token_required
def edit_post(current_user, post_id):
	data = request.json
	post = Post.query.filter_by(public_id=post_id).first()
	if post:
		post.caption= data['caption']
		db.session.commit()
		return jsonify({'msg':'Post Edited.'})

	return jsonify({'msg':'Post Not Found.'})