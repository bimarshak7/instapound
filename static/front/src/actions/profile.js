import { GET_PROFILE, PROFILE_ERROR, GET_POSTS, MAKE_FRIEND, PROFILE_UPDATE, DP_UPDATE, SEARCH_USER } from './types';
import { tokenConfig } from './auth';
import axios from 'axios';

export const getProfile = (username) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    axios
        .get('/user/' + username, config)
        .then((res) => {
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });
            dispatch({
                type: GET_POSTS,
                payload: res.data.posts,
            });
        })
        .catch((err) => {
            //console.log(err.response)
            //window.alert(err.response.data)
            dispatch({
                type: PROFILE_ERROR,
                payload: err
            });
        });
}


//Follow or unfollow profile
export const makeFriend = (username) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    //console.log(config)
    axios
        .put('/makefriend/' + username, {}, config)
        .then((res) => {
            dispatch({
                type: MAKE_FRIEND,
                payload: res.data,
            });
        })
        .catch((err) => {
            //console.log(err.response)
            //window.alert(err.response.data)
            dispatch({
                type: PROFILE_ERROR,
                payload: err
            });
        });
}

export const editProfile = (data) => (dispatch, getState) => {
    // Headers
    let formData = new FormData()
    data['dp'] = data['preview']
    delete data.preview
    const keys = Object.keys(data)
    if (keys.length > 0) {
        keys.forEach(index => {
            if ((typeof data[index] != 'string' || data[index].trim() != '') && index != 'dp') {
                formData.append(index, data[index])
            }
        });
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-acess-token': getState().auth.token
            }
        };
        const pid = getState().auth.pid
        console.log(formData.entries());
        axios
            .put('/user', formData, config)
            .then((res) => {
                window.alert('Changed Saved!')
                //window.location.reload()
                dispatch({
                    type: PROFILE_UPDATE,
                    payload: data,
                });
                dispatch({
                    type: DP_UPDATE,
                    payload: data.dp,
                });
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: PROFILE_ERROR,
                    payload: err
                });
            });
    }
}

//Search Users From Navbar
export const searchUser = (query) => (dispatch, getState) => {
    const config = tokenConfig(getState);
    // console.log(query)
    if (query.trim() == '') {
        query = '*'
    }
    //console.log('Blank', query)
    axios
        .get('/search/' + query, config)
        .then((res) => {
            //console.log(res.data)
            dispatch({
                type: SEARCH_USER,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.log(err)
            //window.alert(err.response.data)
        });
}
