import { REGISTER_SUCCESS, REGISTER_FAILED, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, LOAD_USER, DP_UPDATE } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    user: null,
    flag: false,
    pid: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                flag: true
            }
        case REGISTER_FAILED:
        case LOGIN_FAILED:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                ...action.payload,
                isAuthenticated: false,
                flag: false
            }
        case LOAD_USER:
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                isAuthenticated: true
            }
        case DP_UPDATE: {
            return {
                ...state,
                dp: action.payload
            }
        }
        default:
            return state
    }
}