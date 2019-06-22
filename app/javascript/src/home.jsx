import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { authenticate, signinUser, loginUser, createUser } from './requests/requests';

import 'bootstrap/dist/css/bootstrap';
import './home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      signupUsername: '',
      signupEmail: '',
      signupPassword: '',
      loginUsername: '',
      loginPassword: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  authRedirect() {
    authenticate()
      .then(response => {
        if (response.authenticated) {
          window.location.replace("/dashboard");
        }
      })
      .catch(error => console.log(error));
  }


  handleLogin(e) {
    e.preventDefault();
    let { loginUsername, loginPassword } = this.state;

    signinUser(loginUsername, loginPassword)
      .then(() => {
        this.setState({ loginUsername: '', loginPassword: '' })
        this.authRedirect();
      })
      .catch(error => console.log(error));

  };

  handleSignUp(e) {
    e.preventDefault();

    let { signupUsername, signupEmail, signupPassword } = this.state;

    createUser(signupUsername, signupEmail, signupPassword)
      .then(() => {
        signinUser(signupUsername, signupPassword)
          .then(() => {
            this.setState({ signupUsername: '', signupEmail: '', signupPassword: '' })
            this.authRedirect();
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));

  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value })
  }



  render() {

    return (
      <div className="container">
    <div className="row">
      <div className="col-xs-12 col-md-6 communication mb-4">
        <div className="align-middle message">
          <p><FontAwesomeIcon icon={faSearch} /> Follow your interests.</p>
          <p><FontAwesomeIcon icon={faComment} /> Hear what people are talking about.</p>
          <p><FontAwesomeIcon icon={faUserFriends} /> Join the conversation.</p>
        </div>
      </div>
      <div className="col-xs-12 col-md-6 px-5 utility">
        <div>
        
          <form>
            <input 
              className="log-in username d-block mb-2" 
              type="text" 
              name="loginUsername"
              placeholder="Username" 
              onChange={this.handleChange}
            />
            <input 
              className="log-in password d-block mb-2" 
              type="password" 
              name="loginPassword"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <button onClick={this.handleLogin} className="btn btn-primary">Log in</button>
          </form>
        </div>
        <div>
        <div className="mt-3 mb-3"><FontAwesomeIcon icon={faTwitter} size="3x" color="#1ea1f2" /></div>
          <p>See what’s happening in</p>
          <p>the world right now</p>
          <p>Join Twitter today.</p>
          <form>
            <input 
              className="sign-up username d-block mb-2" 
              type="text" 
              name="signupUsername"
              placeholder="Username"
              onChange={this.handleChange}
            />
            <input 
              className="sign-up email d-block mb-2" 
              type="text" 
              name="signupEmail"
              placeholder="Email" 
              onChange={this.handleChange}
            />
            <input 
            className="sign-up password d-block mb-2" 
            type="password" 
            name="signupPassword"
            placeholder="Password" 
            onChange={this.handleChange}
            />
            <button onClick={this.handleSignUp} className=" btn btn-outline-primary" >Sign up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div'))
  )
})
