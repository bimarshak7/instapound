import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../actions/auth';
import { searchUser } from '../../actions/profile';
import { NavLink } from 'react-router-dom'

const Nav = () => {
    const auth = useSelector(state => state.auth);
    const res = useSelector(state => state.profile.result)
    const dispatch = useDispatch()
    const onclick = (e) => {
        dispatch(logout())
    }
    const onSearch = e => {
        //  setQuery(e.target.value)
        dispatch(searchUser(e.target.value))
    }

    return (
        <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-dark" >
            <div className="container-fluid">
                <NavLink to='/' className="navbar-brand" >InstaPound :)</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {auth.isAuthenticated ?
                    <div className="dropdown row collapse navbar-collapse justify-content-md-end justify-content-sm-start" id="navbarNav">
                        <i className="fas fa-search my-2 my-sm-0"></i>
                        <input className="dropdown-toggle form-control col-5" type="search" placeholder="Search" aria-label="Search" onChange={onSearch} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" />
                        <ul className="dropdown-menu justify-content-md-center justify-content-sm-start col-5" aria-labelledby="navbarDropdown">
                            {Object.keys(res).length === 0 ? <li className="dropdown-item">No matching results.</li> :
                                Object.keys(res).map(key => (
                                    <li key={key}><a className="dropdown-item" href={'#/profile/' + res[key].username}>{res[key].name}<br /><small>(@{res[key].username})</small></a></li>

                                ))

                            }
                        </ul>
                    </div>
                    : ''}
                {auth.isAuthenticated ?
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="navbar-text">
                                <NavLink to={'/profile/' + auth.username}> <strong>{auth.username}</strong></NavLink>
                            </li>
                            <li className="nav-item">
                                <a onClick={onclick} className='nav-link' href='/#/login'>Logout</a>
                            </li>
                        </ul>
                    </div>
                    : ''}
            </div>
        </nav >
    )
}


export default Nav;