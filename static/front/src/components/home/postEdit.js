import React, { useState, useEffect } from 'react';
import { createPost, editPost } from "../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import { postEdit } from '../../actions/posts'
const PostEdit = (props) => {
    const post = props.post;
    const [caption, setCaption] = useState(post.caption)
    // console.log(props)
    const resetForm = e => {
        setCaption(post.caption);
        props.setEdit(prev => ({ ...prev, status: false }))
        document.getElementById("post-form").reset();
    }
    const dispatch = useDispatch()
    const onSubmit = e => {
        e.preventDefault()
        props.setEdit(prev => ({ ...prev, status: false }))
        dispatch(editPost(post.id, caption, props.index))
    }
    const onChange = (e) => setCaption(e.target.value);

    return (
        <div className='edit-modal'>
            <div className='edit-content'>
                <h2>Edit Post</h2>
                <form id='post-form' onSubmit={onSubmit}>
                    <div className="modal-body">
                        <div className='post-form translate-middle'>
                            <div className="input-group">
                                <textarea onChange={onChange} className="form-control" name='caption' cols='70' value={caption}></textarea>
                            </div>
                            <div className="form-group">
                                {post.image ? <div> <img src={'/static/uploads/posts/' + post.image} height='300px' width='300px' />
                                </div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id='dismiss' onClick={resetForm} className="btn btn-secondary" data-bs-dismiss="modal" >Discard</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostEdit;