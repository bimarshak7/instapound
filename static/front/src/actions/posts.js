import { tokenConfig } from './auth';
import { GET_POSTS, CREATE_POST, POST_FAILED, FETCH_ERROR, LIKE_POST, DELETE_POST, EDIT_POST } from './types';
import axios from 'axios';

export const getPosts = () => (dispatch, getState) => {
    const config = tokenConfig(getState);
    axios
        .get('/posts', config)
        .then((res) => {
            dispatch({
                type: GET_POSTS,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.log(err)
            //window.alert(err.response.data)
            dispatch({
                type: FETCH_ERROR,
                payload: err
            });
        });
}

//Fetch Single Post with given id
export const getPost = (id) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    // console.log(id)
    axios
        .get('/post/' + id, config)
        .then((res) => {
            dispatch({
                type: GET_POSTS,
                payload: res.data,
            });
        })
        .catch((err) => {
            //console.log(err.response)
            //window.alert(err.response.data)
            dispatch({
                type: FETCH_ERROR,
                payload: err.response.data
            });
        });
}

export const likePost = (id, key = 0) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    //console.log(config)
    axios
        .put('/like/' + id, {}, config)
        .then((res) => {
            dispatch({
                type: LIKE_POST,
                key: key
            });
        })
        .catch((err) => {
            //  console.log('Like action failed.')
            console.log(err)
        });

}

export const createPost = ({ caption, file }) => (dispatch, getState) => {
    // Headers
    let formdata = new FormData()
    formdata.append('caption', caption)
    formdata.append('file', file)
    //console.log(file)

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-acess-token': getState().auth.token
        }
    };
    axios
        .post('/post', formdata, config)
        .then((res) => {
            //console.log(res.data)
            //$('#exampleModal').modal('hide')
            window.alert('Posted')
            window.location.reload()
            dispatch({
                type: CREATE_POST,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type: POST_FAILED
            });
        });
}

export const deletePost = (id, key = 0) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    //console.log(config)
    axios
        .delete('/post/' + id, config)
        .then((res) => {
            // console.log(res)
            dispatch({
                type: DELETE_POST,
                key: key
            });
        })
        .catch((err) => {
            //  console.log('Like action failed.')
            console.log(err)
        });

}

export const editPost = (id, caption, key) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    axios
        .put('/post/' + id, { 'caption': caption }, config)
        .then((res) => {
            dispatch({
                type: EDIT_POST,
                key: key,
                caption: caption
            });
        })
        .catch((err) => {
            //  console.log('Like action failed.')
            console.log(err)
        });
}