import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter, Switch, Redirect, Link } from 'react-router-dom';
import cookie from 'react-cookies';
import AdminHome from './src/pages/drive';
import AdminPanel from './src/components/admin-panel';
import firebase from 'firebase';
import './src/scss/style.scss';
import { DRIVE_BASE_PATH } from './src/util/const';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			siteTitle: 'DRIVE CLONE',
		};
	}

	UNSAFE_componentWillMount(){
		var firebaseConfig = {
			...{}
			// paste the firebase config here
        };
        firebase.initializeApp(firebaseConfig);
		onload = () => {
			this.setState({open: true});
		};
	}

	renderRoutes = () => {

		// const { sessionUser } = this.state;
		// if(!cookie.load('session')){
		// 	return (
		// 		<Switch>
		// 			<Route path="/login" component={Login} />
		// 			<Redirect to="/login" />
		// 		</Switch>
		// 	)
		// }

		return (
			<Switch>
				<Route path={"/" + DRIVE_BASE_PATH} exact component={AdminHome} />
				<Route path={"/" + DRIVE_BASE_PATH + "/:_id"} exact component={AdminHome} />
				<Redirect to={"/" + DRIVE_BASE_PATH} />
			</Switch>
		);
	};

	render() {
		if(!this.state.open){
			return null;
		}
		// else if(!cookie.load('session')) {
		// 	return (
		// 		<BrowserRouter>
		// 			<section className="">{this.renderRoutes()}</section>
		// 		</BrowserRouter>
		// 	)
		// }
		return (
			<BrowserRouter>
				<div className="Main-Comp">
					<AdminPanel 
						siteTitle={this.state.siteTitle}
						mainComponent={<section className="">{this.renderRoutes()}</section>}
					/>
					<div className="dropdown-menu dropdown-menu-sm" id="context-menu">
						<a className="dropdown-item" data-action="download" href="#">Download</a>
						<a className="dropdown-item" data-action="rename" href="#">Rename</a>
						<a className="dropdown-item" data-action="delete" href="#">delete</a>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default connect(null)(App);
