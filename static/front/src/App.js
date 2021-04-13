import React from 'react';
import './app.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";
import store from './store';

import Login from './components/account/login';
import Register from './components/account/register';
import Navbar from './components/commom/navbar';
import PrivateRoute from './components/commom/privateRoute';
import Dashboard from './components/home/dashboard';
import Post from './components/home/singlePost';
import Profile from './components/home/profile';
import Error404 from './components/commom/error404';
import ChnagePsw from './components/account/changePsw';

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<div className='container'>
					<Switch>
						<Route exact path='/login' component={Login} />
						<Route exact path='/register' component={Register} />
						<PrivateRoute component={Dashboard} exact path='/' />
						<PrivateRoute component={Post} path='/post/:id' />
						<PrivateRoute component={Profile} path='/profile/:username' />
						<PrivateRoute component={ChnagePsw} path='/changepsw' />
						<Route path="*" component={Error404} />
					</Switch>
				</div>
			</Router>
		</Provider>
	)
}

export default App;