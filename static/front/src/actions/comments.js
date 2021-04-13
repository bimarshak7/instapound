import { POST_COMMENT, DELETE_COMMENT, LIKE_COMMENT } from './types';
import { tokenConfig } from './auth';
import axios from 'axios';

export const postComment = (post_id, text, key) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    const auth = getState().auth
    axios
        .post('/comment', { 'post_id': post_id, 'text': text }, config)
        .then((res) => {
            const comment = { 'id': res.data.id, 'text': text, 'name': auth.name, 'username': auth.username, 'time': new Date().toString(), 'dp': auth.dp }
            dispatch({
                type: POST_COMMENT,
                cmt: comment,
                key: key
            });
        })
        .catch((err) => {
            console.log(err)
        });
}

export const deleteComment = (id, c_key, p_key) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    const auth = getState().auth
    axios
        .delete('/comment/' + id, config)
        .then((res) => {
            dispatch({
                type: DELETE_COMMENT,
                c_key: c_key,
                p_key: p_key
            });
        })
        .catch((err) => {
            console.log(err)
        });
}

export const likeComment = (id, c_key, p_key) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    //console.log(config)
    axios
        .put('/like/' + id, {}, config)
        .then((res) => {
            dispatch({
                type: LIKE_COMMENT,
                c_key: c_key,
                p_key: p_key
            });
        })
        .catch((err) => {
            //  console.log('Like action failed.')
            console.log(err)
        });

}