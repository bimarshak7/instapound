import React, { useState, useEffect } from 'react';
import { editProfile } from "../../actions/profile";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileForm = () => {
    const profile = useSelector(state => state.profile.user)
    const own = useSelector(state => state.auth)
    const [data, setData] = useState({
        preview: profile.dp,
    })
    const dispatch = useDispatch()

    const onSubmit = e => {
        e.preventDefault()
        //console.log('Submitted')
        if (data.file && data.file.size > 2000000) {
            window.alert("Photo size should be less than 2MB.")
        }
        else {
            dispatch(editProfile(data))
            resetForm(e)
        }
    }
    const onChange = (e) => {
        if (e.target.name === 'file') {
            let file = e.target.files[0]
            setData(prev => ({ ...prev, preview: URL.createObjectURL(file), file: e.target.files[0] }));
        }
        else {
            let field_name = e.target.name;
            let field_value = e.target.value;
            setData(prev => ({ ...prev, [field_name]: field_value }));
        }
    }
    const clearPic = e => {
        setData({ ...data, preview: 'static/uploads/dp/default.png', file: null });
    }
    const resetForm = e => {
        //console.log(e)
        setData(prev => ({ preview: profile.dp }));
        document.getElementById("profile-form").reset();
    }
    return (
        <div>
            <div className="modal fade" id="profileEditModal" tabIndex="-1" aria-labelledby="profileEditModalLabel" data-backdrop="false" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="profileEditModalLabel">Edit Profile</h5>
                        </div>
                        <form id='profile-form' className='form-horizontal' onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className="col-4">
                                        <img src={data.preview} height='150px' width='150px' />
                                        <button onClick={clearPic} type="button" className="clear-pic">X</button>
                                        <label className='change-dp' htmlFor='upload'>Change DP</label>
                                        <input
                                            id='upload'
                                            type="file"
                                            accept="image/*"
                                            className="form-control upload"
                                            name="file"
                                            onChange={onChange}
                                        />
                                        <Link to='/changepsw' className='change-psw'>Change Password</Link>
                                    </div>
                                    <div className="col">
                                        <div className="row mb-3">
                                            <label className="col-sm-2 col-form-label">First Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" name='first_name' placeholder={profile.first_name} onChange={onChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-2 col-form-label">Last Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" name='last_name' onChange={onChange} className="form-control" placeholder={profile.last_name} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-2 col-form-label">Email</label>
                                            <div className="col-sm-10">
                                                <input type="email" onChange={onChange} name='email' className="form-control" placeholder={own.email} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-2 col-form-label">Bio</label>
                                            <div className="col-sm-10">
                                                <textarea className="form-control" onChange={onChange} name='bio' placeholder={profile.bio} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button id='dismiss' onClick={resetForm} className="btn btn-secondary" data-bs-dismiss="modal" >Discard</button>
                                <button onClick={onSubmit} className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )

}

export default ProfileForm;