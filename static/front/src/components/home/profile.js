import React, { useState, useEffect } from 'react';
import { getProfile, makeFriend } from "../../actions/profile";
import { useDispatch, useSelector } from "react-redux";
import Loading from '../commom/loading';
import { Link } from 'react-router-dom';
import Feed from './feed'
import ProfileForm from './profileForm'
import { deleteUser } from '../../actions/auth';

const Profile = (props) => {
    const username = props.match.params.username
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProfile(username))
    }, [username]);

    const profile = useSelector(state => state.profile)
    const own = useSelector(state => state.auth.username)

    const frnClick = e => {
        dispatch(makeFriend(profile.user.username))
    }
    const onDelete = e => {
        dispatch(deleteUser())
    }

    if (profile.isLoading) {
        return <Loading />
    }

    if (profile.msg) {
        return <h1>{profile.user.msg}</h1>
    }
    return (
        <>
            <div className="page-content page-container" id="page-content">
                <div className="row container d-flex justify-content-center">
                    <div className="card">
                        {username == own ?
                            <div className="d-flex justify-content-end dropdown" style={{ margin: '0.4rem' }}>
                                <i className="fas fa-ellipsis-h dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown"></i>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link to='/changepsw' className="dropdown-item">Change Password</Link>
                                    <button onClick={onDelete} className="dropdown-item">Delete Account</button>
                                </ul>
                            </div>
                            : ''}
                        <div className="card-body text-center">
                            <div> <img src={profile.user.dp} className="img-lg rounded-circle" alt="profile image" />
                                <h4>{profile.user.first_name} {profile.user.last_name}</h4>
                                <p className="text-muted mb-0">@{profile.user.username}</p>
                            </div>
                            <p className="mt-2 card-text">{profile.user.bio} </p>
                            {
                                profile.user.username == own ?
                                    <button className="btn btn-info btn-sm mt-3 mb-4" data-bs-toggle="modal" data-bs-target="#profileEditModal">Edit Profile</button> :
                                    <button onClick={frnClick} className="btn btn-info btn-sm mt-3 mb-4">{profile.user.frnship == 1 ? 'Delete Friend' : 'Make Friend'}</button>
                            }
                            <ProfileForm />
                            < div className="border-top border-bottom pt-3">
                                <div className="row">
                                    <div className="col-4">
                                        <h6>{profile.user.posts}</h6>
                                        <p>Posts</p>
                                    </div>
                                    <div className="col-4">
                                        <h6>{profile.user.friends}</h6>
                                        <p>Friends</p>
                                    </div>
                                    <div className="col-4">
                                        <h6>{profile.user.likes}</h6>
                                        <p>Likes</p>
                                    </div>
                                </div>
                            </div>
                            <Feed a={1} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;