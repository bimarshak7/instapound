import { GET_PROFILE, MAKE_FRIEND, PROFILE_ERROR, PROFILE_UPDATE, SEARCH_USER } from '../actions/types.js';

const initialState = {
    user: [],
    isLoading: true,
    result: {},
    msg: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE:
            //console.log('Profile Reducer Called')
            return {
                ...state,
                user: action.payload.user,
                msg: action.payload.msg,
                isLoading: false
            };
        case MAKE_FRIEND:
            const new_status = state.user.frnship == 1 ? 0 : 1
            return {
                ...state,
                user: { ...state.user, frnship: new_status }
            }
        case PROFILE_UPDATE:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            }
        case SEARCH_USER: {
            return {
                ...state,
                result: action.payload
            }
        }
        case PROFILE_ERROR:
            return {
                ...state,
                isLoading: false,
            }

        default:
            return state;
    }
}