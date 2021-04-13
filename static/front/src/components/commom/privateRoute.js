import React, { useEffect } from 'react'
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from '../../actions/auth'
import Login from '../account/login'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        if (auth.token) {
            dispatch(loadUser())
        }
    }, [auth.isAuthenticated]);
    return (
        <Route
            {...rest}
            render={props => {
                if (auth.isAuthenticated) {
                    return <Component {...props} />
                }
                return (
                    <>
                        <Login msg={rest.path != '/' ? 'Please login to continue.' : ''} />

                    </>
                )
            }}
        />
    )
}
export default PrivateRoute;