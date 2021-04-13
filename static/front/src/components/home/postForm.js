import React, { useState } from 'react';
import { createPost } from "../../actions/posts";
import { useDispatch, useSelector } from "react-redux";

const PostForm = () => {
    const [post, setPost] = useState({
        caption: '',
        preview: ''
    })
    const dispatch = useDispatch()
    const dp = useSelector(state => state.auth.dp)

    const onSubmit = e => {
        e.preventDefault()
        //console.log('Submitted')
        if (post.file && post.file.size > 2000000) {
            window.alert("Photo size should be less than 2MB.")
        }
        else {
            dispatch(createPost(post))
        }
    }
    const onChange = (e) => {
        if (e.target.name === 'file') {
            let file = e.target.files[0]
            setPost(prev => ({ ...prev, preview: URL.createObjectURL(file), file: e.target.files[0] }));
        }
        else {
            let field_name = e.target.name;
            let field_value = e.target.value;
            setPost(prev => ({ ...prev, [field_name]: field_value }));
        }
    }
    const clearPic = () => {
        setPost({ ...post, preview: '', file: null });
    }
    const resetForm = () => {
        //console.log(e)
        setPost(prev => ({ ...prev, caption: '', preview: '', file: null }));
        document.getElementById("post-form").reset();
    }
    return (
        <div>
            <div className="post post-card border open-form" data-bs-toggle="modal" data-bs-target="#newPostModal">
                <img className='dp-form dp-sm' src={'/static/uploads/dp/' + dp} />
                <p className="text-center qn">What's On your mind?</p>
            </div>
            <div className="modal fade" id="newPostModal" tabIndex="-1" aria-labelledby="newPostModalLabel" data-backdrop="false" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="newPostModalLabel">Create Post</h5>
                        </div>
                        <form id='post-form' onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className='post-form translate-middle'>
                                    <div className="input-group">
                                        <textarea onChange={onChange} className="form-control" name='caption' cols='70' placeholder="What's on your mind?"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className='new-button' htmlFor='upload'> Chose a photo</label>
                                        <input
                                            id='upload'
                                            type="file"
                                            accept="image/*"
                                            className="form-control upload"
                                            name="file"
                                            onChange={onChange}
                                        />

                                        {post.preview != '' ? <div> <img src={post.preview} height='300px' width='300px' />
                                            <button onClick={clearPic} type="button" className="clear-pic">X</button></div> : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button id='dismiss' onClick={resetForm} className="btn btn-secondary" data-bs-dismiss="modal" >Discard</button>
                                <button type="submit" className="btn btn-primary">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )

}

export default PostForm;