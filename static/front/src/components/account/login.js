import React, { useState, useEffect } from 'react';
import { Link, Redirect } from "react-router-dom";
import { login } from "../../actions/auth";
import { useDispatch, useSelector } from "react-redux";

const Login = (props) => {
    const [state, setState] = useState({
        username: '',
        password: '',
    })

    const dispatch = useDispatch();
    const onSubmit = e => {
        e.preventDefault()
        dispatch(login(state))
    }
    const onChange = (e) => {
        let field_name = e.target.name;
        let field_value = e.target.value;
        setState(prev => ({ ...prev, [field_name]: field_value }));
    }


    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    if (isAuthenticated) {
        return <Redirect to='/' />
    }

    return (
        <div className="col-md-6 m-auto">
            {props.msg ? <h2 style={{ position: 'absolute' }}>{props.msg}</h2> : ''}
            <div className="card card-body mt-5">
                <h2 className="text-center">Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Login
                            </button><br />
                            Don't have an account? <Link to="/register">Register</Link>
                    </div>
                    <p>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;