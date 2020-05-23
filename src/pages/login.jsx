import React from 'react';
import { connect } from 'react-redux';
import MAXIOS from '../services';
import Notifier from '../components/notifier';
import cookie from 'react-cookies';
class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            sessionUser: props.sessionUser,
            loginEmail: '',
            loginPassword: '',
            notifier: false,
            color: 'primary',
            message: '',
            success: false,
            isApiProcessing: false,
        }
        $('body').addClass('bg-gradient-primary');
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.sessionUser) {
            this.setState({sessionUser: nextProps.sessionUser});
        }
    }

    login(e){
        e.preventDefault();
        if(!$('#mloginForm').parsley().validate()){
            return;
        }

        var data = {
            email: this.state.loginEmail,
            password: this.state.loginPassword,
            isAdmin: true
        };
        this.setState({isApiProcessing: true});
        MAXIOS('post', 'login', data, null, (data) => {
            const { code, message, data: { accessToken } } = data;
			if (code == 'devlabs_020') {
				cookie.save('session', accessToken, { path: '/' });
				window.location.reload();
			} else {
				this.setState({
					color: 'danger',
					message: message,
                    notifier: true,
                    isApiProcessing: false
				});
			}
		});
    }

    render(){
        const { notifier, color, message, loginEmail, loginPassword } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                            </div>
                                            <form className="user" id="mloginForm" action="" onSubmit={this.login.bind(this)}>

                                                <div className="malert merror">
                                                    <span>!</span>
                                                    <p className="mclose">x</p>
                                                </div>

                                                <div className="form-group" >
                                                    <input type="email" value={loginEmail} onChange={(e) => this.setState({loginEmail: e.target.value})} required className="form-control form-control-user" placeholder="Enter email address" />
                                                </div>
                                                <div className="form-group" >
                                                    <input type="password" value={loginPassword} onChange={(e) => this.setState({loginPassword: e.target.value})} required className="form-control form-control-user" placeholder="Password" / >
                                                </div>
                                                <div className="form-group">
                                                    <div className="custom-control custom-checkbox small">
                                                        <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                        <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                                    </div>
                                                </div>
                                                <Notifier show={notifier} color={color} message={message} />
                                                <button type="submit" onClick={this.login.bind(this)} className="btn btn-primary btn-user btn-block">Login</button>
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <a className="small" id="reset-pass" href="#">Reset Password?</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}

export default connect((state) => {
    return { sessionUser: state.sessionUser }
})(Login);