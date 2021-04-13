import React, { useState, useEffect } from 'react';
import { Link, Redirect } from "react-router-dom";
import { changePsw } from "../../actions/auth";
import { useDispatch, useSelector } from "react-redux";

const ChnagePsw = () => {
    const [state, setState] = useState({
        password: '',
        password1: '',
        password2: '',
    })
    const dispatch = useDispatch();
    const onSubmit = e => {
        console.log('Callled')
        e.preventDefault()
        if (state.password1 !== state.password2) {
            window.alert("Password didn't match!")
        }
        dispatch(changePsw(state))
    }
    const onChange = (e) => {
        let field_name = e.target.name;
        let field_value = e.target.value;
        setState(prev => ({ ...prev, [field_name]: field_value }));
    }

    return (
        <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
                <h2 className="text-center">Change Password</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Current Pasword</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password1"
                            onChange={onChange}
                            required
                        />
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password2"
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Change
                            </button>
                    </div>
                    <p>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default ChnagePsw;