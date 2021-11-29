import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { cv } from '../commom/helper';
import { deleteComment, postComment, likeComment } from '../../actions/comments';

const Comments = (props) => {
    const comment = useSelector(state => state.post.posts[props.index].comment)
    const [text, setText] = useState('')
    const own = useSelector(state => state.auth.username)
    const onChange = e => {
        setText(e.target.value)
    }
    const dispatch = useDispatch()
    const onSubmit = () => {
        if (text != '') {
            dispatch(postComment(props.id, text.trim(), props.index))
            setText('')
        }
    }
    return (
        <div className="comments border-top">
            <div className="comment-input mb-1 mt-1"> <input value={text} onChange={onChange} type="text" className="form-control" placeholder='Write a comment...' />
                <div onClick={onSubmit} className="fonts"> <i className="fas fa-location-arrow" style={{ transform: 'rotate(45deg)' }}></i> </div>
            </div>
            {comment == null ? '' :
                Object.keys(comment).map(key => (
                    <div key={key} className="d-flex flex-row mb-2 mt-3"> <img src={'/static/uploads/dp/' + comment[key].dp} width="40" className="rounded-image" />
                        <div className="d-flex flex-column ml-2"> <span className="name"><Link to={'/profile/' + comment[key].owner}>{comment[key].name}</Link></span><small className="comment-text">{comment[key].text}</small>
                            <div style={{ cursor: 'pointer' }} className="d-flex flex-row align-items-center status">
                                <small onClick={e => dispatch(likeComment(comment[key].id, key, props.index))}><i className={comment[key].own_like == 1 ? 'fas fa-heart' : 'far fa-heart'}>{comment[key].likes}</i></small>
                                <small>{cv(comment[key].time)}</small>
                                {comment[key].owner == own ? <small onClick={e => dispatch(deleteComment(comment[key].id, key, props.index))}>{comment[key].owner == own ? 'Delete' : ''}</small> : ''}
                            </div>
                        </div>
                    </div>
                ))
            }
            {props.n > 1 & props.a != 2 ? <Link to={'/post/' + props.id}>View All Comments</Link> : ''}
        </div>
    )
}

export default Comments;