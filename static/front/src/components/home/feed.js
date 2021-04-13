import React, { useState, useEffect } from 'react';
import { getPosts, likePost, deletePost } from "../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import Loading from '../commom/loading';
import { Link } from 'react-router-dom';
import { cv } from '../commom/helper';
import PostEdit from './postEdit'
import Comments from './comments'

const Feed = (props) => {
    const isLoading = useSelector(state => state.post.isLoading)
    const dispatch = useDispatch()
    const a = props.a;
    useEffect(() => {
        if (a === 0) {
            dispatch(getPosts())
        }
    }, [a]);
    const posts = useSelector(state => state.post.posts)
    const user = useSelector(state => state.auth.username)
    const onLike = (e, id, key) => {
        dispatch(likePost(id, key))
        //console.log(id)
    }
    const onDelete = (e, id, key) => {
        //console.log('Delete action called')
        dispatch(deletePost(id, key))
    }
    const [edit, setEdit] = useState({
        'status': false,
        'post': null,
        'key': null
    })
    const onEdit = (e, key) => {
        setEdit({ ...edit, status: true, post: posts[key], key: key })
    }
    if (Object.keys(posts).length === 0) {
        return (<h1>No posts to show.</h1>)
    }
    return (
        <div>
            {edit.status ?
                <PostEdit index={edit.key} post={edit.post} setEdit={setEdit} /> : ''}
            {isLoading
                ? Loading()
                :
                Object.keys(posts).map(key => (
                    <div key={posts[key].id} className="post-card card">
                        <div className="border-bottom d-flex justify-content-between p-2 px-3">
                            <div className="d-flex flex-row align-items-center"> <img src={posts[key].dp} width="50" className="dp-sm rounded-circle" />
                                <div className="d-flex flex-column ml-2"> <span className="font-weight-bold"><Link to={'/profile/' + posts[key].owner}>{posts[key].name}</Link></span><small className="text-primary">{posts[key].owner}</small>
                                </div>
                            </div>
                            <div className="d-flex flex-row mt-1 ellipsis"> <small className="mr-2">{cv(posts[key].time)}</small>
                                {posts[key].owner == user ?
                                    <div className="dropdown">
                                        <i className="fas fa-ellipsis-h dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown"></i>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <button onClick={e => onDelete(e, posts[key].id, key)} className="dropdown-item">Delete Post</button>
                                            <button onClick={(e) => onEdit(e, key)} className="dropdown-item">Edit Post</button>
                                        </ul>
                                    </div>
                                    : ''}
                            </div>
                        </div>
                        {posts[key].image ? <Link to={'/post/' + posts[key].id}><img className="post-img img-fluid" src={'/static/uploads/posts/' + posts[key].image} /></Link> : ''}
                        <div className="p-2">
                            <p className="text-justify">{posts[key].caption}</p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '0.7rem' }}>
                                <div className="d-flex flex-row icons d-flex align-items-center"> <i onClick={e => onLike(e, posts[key].id, key)} className={posts[key].own_like == 1 ? 'fas fa-heart' : 'far fa-heart'}></i> </div>
                                <div className="d-flex flex-row">
                                    <span className='pr-3'>
                                        {posts[key].likes} {posts[key].likes == 1 ? 'Like' : 'Likes'}
                                    </span>
                                    <span className='pr-1'>{posts[key].comments} {posts[key].comments == 1 ? 'Comment' : 'Comments'}</span>
                                </div>
                            </div>
                            <Comments index={key} n={posts[key].comments} a={props.a} id={posts[key].id} />
                        </div>
                    </div>

                ))
            }
            {posts.length === 0 ? 'No Posts to show' : ''}
        </div>
    );
}

export default Feed;