from models import Comments, User,Post, Friendship,Likes
import os
from werkzeug.utils import secure_filename
from flask import request, jsonify
from main import db,app
from routes.auth import token_required

@app.route("/makefriend/<friend>", methods=['PUT'])
@token_required
def add_friend(current_user,friend):
    user2 = User.query.filter_by(username=friend).first()
    if user2 is None:
        return jsonify({'msg':'User not found.'})
    user1 = current_user
    #print(user2)
    query = Friendship.query.filter(((Friendship.user_a==current_user.public_id)&(Friendship.user_b==user2.public_id))|((Friendship.user_b==current_user.public_id)&(Friendship.user_a==user2.public_id))).first()
    #print('Query is',query)
    
    if query is None:
        if user1.id >user2.id:
            user1,user2 = user2, user1   
        new_friendship =  Friendship(
            user_a = user1.public_id,
            user_b = user2.public_id,
            status = 1,
            action_user = current_user.public_id
            )
        #print('New is', new_friendship) 
        db.session.add(new_friendship)
        db.session.commit()
        return jsonify({'msg':'Request Sent.'})
    else:
        query.status = 0 if query.status==1 else 1

    db.session.commit()

    return jsonify({'msg':'Invalid Request.'})

@app.route('/user/<username>', methods=['GET'])
@token_required
def get_user(current_user, username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'msg':'User not found'})
    
    user_data={}
    user_data['username']=user.username
    user_data['first_name']=user.first_name
    user_data['last_name']=user.last_name
    user_data['email']=user.email
    user_data['bio']=user.bio
    user_data['public_id']=user.public_id
    user_data['dp']='static/uploads/dp/'+user.dp

    posts = Post.query.filter_by(user_pid=user.public_id).order_by(Post.time.desc()).all()
    user_data['posts'] = len(posts)
    user_data['likes'] = Likes.query.filter_by(user_id=user.public_id).count()
    user_data['friends'] = Friendship.query.filter(((Friendship.user_a==user.public_id)|(Friendship.user_b==user.public_id))&(Friendship.status==1)).count()

    query=Friendship.query.filter(((Friendship.user_a==current_user.public_id)&(Friendship.user_b==user.public_id))|((Friendship.user_b==current_user.public_id)&(Friendship.user_a==user.public_id))).first()

    if query is not None:
        user_data['frnship']=query.status
    else:
        user_data['frnship']=0

    post_data={}
    for i,post in enumerate(posts):
        like = Likes.query.filter((Likes.post_id==post.public_id)&(Likes.user_id==current_user.public_id)).first()
        own_like = 1 if like else 0
        likes = Likes.query.filter(Likes.post_id==post.public_id).count()
        comments = Comments.query.filter(Comments.post_id==post.public_id).count()
        comment=None
        qr= Comments.query.filter_by(post_id=post.public_id).order_by(Comments.time.desc()).first()
        if qr:
            cmtr = User.query.filter_by(public_id=qr.user_id).first()
            comment ={'id':qr.public_id,'text':qr.text,'time':qr.time,'name':cmtr.first_name+' '+cmtr.last_name,'dp':cmtr.dp,'username':cmtr.username}
            comment={'0':comment}
        img = None if post.image =='' else post.image
        dp='/static/uploads/dp/'+user.dp
        post_data[i]={'id':post.public_id,'owner':user.username,'name':user.first_name+' '+user.last_name,'caption':post.caption,'image':img,'time':post.time,'own_like':own_like,'likes':likes,'dp':dp,'comments':comments,'comment':comment}

    return jsonify({'user':user_data,'posts':post_data})


@app.route('/user', methods=['PUT'])
@token_required
def edit_user(current_user):
    data = request.form
    if 'file' in request.files:
        file = request.files['file']
        ext = file.filename.split('.')[1]
        filename = secure_filename(current_user.public_id+'.'+ext)
        if current_user.dp !='default.png':
            os.remove(os.path.join(app.config['UPLOAD_FOLDER']+'/dp',current_user.dp))
        file.save(os.path.join(app.config['UPLOAD_FOLDER']+'/dp', filename))
        file.close()
        print('This is file:', file)
        current_user.dp = filename
    if 'email' in data:
        query = User.query.filter_by(email=data['email'])
        if query: return make_response('Email already used',500)
    if len(data)>0:
        user = User.query.filter_by(public_id=current_user.public_id)
        user.update(data)
    db.session.commit()

    return jsonify({'msg':'Edited'})


@app.route('/search/<qr>', methods=['GET'])
@token_required
def search(current_user,qr):
    query = User.query.filter((User.username.like('%'+qr+'%'))| (User.first_name.like('%'+qr+'%'))|(User.last_name.like('%'+qr+'%'))).all()
    res={}
    for i,q in enumerate(query):
        res[i]={'username':q.username,'name':q.first_name+' '+q.last_name}
    # print(res)
    return jsonify(res)