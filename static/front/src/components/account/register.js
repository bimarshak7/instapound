import React, { useState, useEffect } from 'react';
import { login, register } from '../../actions/auth';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";


const Register = () => {
	const [state, setState] = useState({
		username: '',
		first_name: '',
		last_name: '',
		email: '',
		password1: '',
		password2: '',
		file: null,
		preview: ''
	})

	const onChange = (e) => {
		if (e.target.name === 'file') {
			let file = e.target.files[0]
			setState(prev => ({ ...prev, preview: URL.createObjectURL(file), file: e.target.files[0] }));
		}
		else {
			let field_name = e.target.name;
			let field_value = e.target.value;
			setState(prev => ({ ...prev, [field_name]: field_value }));
		}
	}
	const clearPic = () => setState({ ...post, preview: '', file: null });
	const dispatch = useDispatch();
	const onSubmit = (e) => {
		e.preventDefault()
		if (state.password1 !== state.password2) {
			window.alert("Password didn't match!")
		}
		else if (state.file && state.file.size > 2000000) {
			window.alert("Photo size should be less than 2MB.")
		} else {
			//console.log('Balla Vayo')
			dispatch(register(state))
		}
	}

	const flag = useSelector(state => state.auth.flag);

	if (flag) {
		return <Redirect to='/#/login' />
	}
	return (
		<div className="col-md-6 m-auto">
			<div className="card card-body mt-5">
				<h2 className="text-center">Register</h2>
				<form encType="multipart/form-data" onSubmit={onSubmit}>
					<div className='form-row'>
						<div className="form-group col-md-6">
							<label>First Name</label>
							<input
								type="text"
								className="form-control"
								name="first_name"
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label>Last Name</label>
							<input
								type="text"
								className="form-control"
								name="last_name"
								onChange={onChange}
								required
							/>
						</div>
					</div>
					<div className='form-row'>
						<div className="form-group col-md-6">
							<label>Username</label>
							<input
								type="text"
								className="form-control"
								name="username"
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label>Email</label>
							<input
								type="email"
								className="form-control"
								name="email"
								onChange={onChange}
								required
							/>
						</div>
					</div>
					<div className='form-row'>

						<div className="form-group col-md-6">
							<label>Password</label>
							<input
								type="password"
								className="form-control"
								name="password1"
								onChange={onChange}
								required
							/>
						</div>
						<div className="form-group col-md-6">
							<label>Confirm Password</label>
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
						<label className='new-button' htmlFor='upload'> Chose a DP</label>
						<input
							id='upload'
							type="file"
							accept="image/*"
							className="form-control upload"
							name="file"
							onChange={onChange}
						/>
						{state.preview != '' ? <div> <img src={state.preview} height='30%' width='30%' />
							<button onClick={clearPic} type="button" className="clear-pic">X</button></div> : ''}
					</div>
					<div className="form-group">
						<button type="submit" className="btn btn-primary">
							Register
			  </button>
					</div>
					<p>
						Already have an account? <Link to="/login">Login</Link>
					</p>
				</form>
			</div>
		</div>
	);
}



export default Register;