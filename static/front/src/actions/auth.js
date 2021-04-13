import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAILED, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, LOAD_USER } from "./types";

export const register = ({ username, first_name, last_name, email, password1, file }) => (dispatch) => {
    //console.log('called')
    // console.log(state)
    // Headers
    let formdata = new FormData()
    formdata.append('username', username)
    formdata.append('first_name', first_name)
    formdata.append('last_name', last_name)
    formdata.append('email', email)
    formdata.append('password', password1)
    formdata.append('file', file)

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    axios
        .post('/user', formdata, config)
        .then((res) => {
            window.alert('Account Created.')
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            window.alert(err.response.data)
            dispatch({
                type: REGISTER_FAILED
            });
        });
    //console.log('Done')
}

export const login = ({ username, password }) => dispatch => {
    //Header
    const token = 'Basic ' + btoa(`${username}:${password}`);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    };
    //const body = JSON.stringify({ username, password });
    axios
        .get('/login', config)
        .then((res) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            //console.log(err)
            window.alert(err.response.data)
            dispatch({
                type: LOGIN_FAILED,
                payload: err.data
            });
        });
}

//Action to logout(delete token from local storage)
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};

//Load user details after loagin
export const loadUser = () => (dispatch, getState) => {
    const config = tokenConfig(getState)
    axios
        .get('/user', config)
        .then((res) => {
            dispatch({
                type: LOAD_USER,
                payload: res.data,
            });
        })
        .catch((err) => {
            //console.log(err.response)
            dispatch({
                type: LOGIN_FAILED,
                payload: err.data
            });
        });
}

// Change Password and logout if changed sucessfully
export const changePsw = ({ password, password1 }) => (dispatch, getState) => {
    let formdata = new FormData()
    formdata.append('password', password)
    formdata.append('new_password', password1)

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-acess-token': getState().auth.token
        }
    };

    axios
        .put('/psw', formdata, config)
        .then((res) => {
            window.alert('Password Changed.')
            dispatch({
                type: LOGOUT,
                payload: res.data,
            });
        })
        .catch((err) => {
            window.alert(err.response.data)
        });
}

export const deleteUser = () => (dispatch, getState) => {
    const config = tokenConfig(getState)

    axios
        .delete('/user', config)
        .then((res) => {
            window.alert('Account Deleted.')
            dispatch({
                type: LOGOUT,
                payload: res.data,
            });
        })
        .catch((err) => {
            window.alert(err.response.data)
        });
}

// Setup config with token - helper function
export const tokenConfig = (getState) => {
    // Get token from state
    const token = getState().auth.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // If token, add to headers config
    if (token) {
        config.headers['x-acess-token'] = token;
    }

    return config;
};