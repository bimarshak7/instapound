import { GET_POSTS, ADD_POST, FETCH_ERROR, LIKE_POST, CREATE_POST, DELETE_POST, EDIT_POST, GET_COMMENTS, POST_COMMENT, DELETE_COMMENT, LIKE_COMMENT } from '../actions/types.js';

const initialState = {
    isLoading: true,
    posts: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                isLoading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
            };
        case FETCH_ERROR:
            //localStorage.removeItem('token')
            console.log('Fetch error', action.payload)
            return {
                ...state,
            }
        case LIKE_POST:
            const key = Number(action.key)
            const o_like = state.posts[key]['own_like'] ? 0 : 1
            const o_likes = o_like ? ++state.posts[key]['likes'] : --state.posts[key]['likes']

            const newPosts = { ...state.posts }
            newPosts[key]['own_like'] = o_like
            newPosts[key]['likes'] = o_likes
            //console.log('New', newPosts)
            return {
                ...state,
                posts: newPosts
            }
        case CREATE_POST:
            return {
                ...state,
            }
        case DELETE_POST:
            const latest = state.posts
            delete latest[action.key]
            return {
                ...state,
                posts: { ...latest }
            }
        case EDIT_POST:
            const update = state.posts
            update[action.key].caption = action.caption
            return {
                ...state,
                posts: { ...update }
            }
        case POST_COMMENT:
            const cmt_up = state.posts
            if (cmt_up[action.key].comment == null)
                cmt_up[action.key].comment = {}
            cmt_up[action.key].comment['x'] = action.cmt
            return {
                ...state,
                posts: { ...cmt_up }
            }
        case DELETE_COMMENT:
            const cmt_del = state.posts
            delete cmt_del[action.p_key].comment[action.c_key]
            return {
                ...state,
                posts: { ...cmt_del }
            }
        case LIKE_COMMENT:
            const cmt_like = state.posts

            const oc_like = state.posts[action.p_key].comment[action.c_key]['own_like'] ? 0 : 1
            const oc_likes = oc_like ? ++state.posts[action.p_key].comment[action.c_key]['likes'] : --state.posts[action.p_key].comment[action.c_key]['likes']

            cmt_like[action.p_key].comment[action.c_key]['own_like'] = oc_like
            cmt_like[action.p_key].comment[action.c_key]['likes'] = oc_likes
            return {
                ...state,
                posts: { ...cmt_like }
            }

        default:
            return state;
    }
}