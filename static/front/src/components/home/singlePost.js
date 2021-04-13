import React, { useState, useEffect } from 'react';
import { getPost, likePost } from "../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import Loading from '../commom/loading';
import { Link } from 'react-router-dom';
import './home.css';
import { cv } from '../commom/helper';
import Feed from './feed'

const Post = (props) => {

    const id = props.match.params.id
    const dispatch = useDispatch()
    const post = useSelector(state => state.post)
    const a = null;
    useEffect(() => {
        dispatch(getPost(id))
    }, [a]);
    if (post.isLoading) {
        return <Loading />
    }
    if (post.posts.msg) {
        return <h1>{post.posts.msg}</h1>
    }
    else
        return <Feed a={2} />
}

export default Post;