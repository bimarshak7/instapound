from models import User,Post, Friendship,Likes, Comments
import os
import uuid
from werkzeug.utils import secure_filename
from flask import request, jsonify
from main import db,app
from routes.auth import create_user, token_required

@app.route("/comment", methods=['POST'])
@token_required
def add_comment(current_user):
    data = request.json
    public_id=str(uuid.uuid4())
    new_comment= Comments(
        public_id=public_id,
        text=data['text'],
        post_id=data['post_id'],
        user_id=current_user.public_id
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'msg':'Comment Posted.','id':public_id})


@app.route("/comment/<id>", methods=['DELETE'])
@token_required
def delete_comment(current_user,id):
    comment= Comments.query.filter_by(public_id=id).first()
    if comment:
        if comment.user_id == current_user.public_id:
            db.session.delete(comment)
            db.session.commit()
            return jsonify({'msg':'Comment Deleted'})
    return jsonify({'msg':'Invalid Request.'})

@app.route("/comment/<post_id>/<n>", methods=['GET'])
@token_required
def get_comments(current_user,post_id,n):
    post = Post.query.filter_by(public_id=post_id).first()
    if post is None:
        return jsonify({'msg':'Post not found'})
    
    comments= Comments.query.filter_by(post_id=post_id).order_by(Comments.time.desc())
    if n=='all':comments=comments.all()
    else:comments=comments.limit(n)
    if len(comments.all()) ==0:return jsonify({'msg':'No comments yet.'})
    # print(comments.all())
    res={}
    for i,comment in enumerate(comments):
        name = User.query.filter_by(public_id=comment.user_id).first()
        res[i]={'comment':comment.text,'time':comment.time,'author':name.username,'dp':name.dp,'name':name.first_name+' '+name.last_name}
        print(i)
    
    return jsonify(res)