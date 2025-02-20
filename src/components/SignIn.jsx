import axios from 'axios';
import React, { useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [signinData, setSigninData] = useState({
    emailid: '',
    password: '',
  });

  // Handle input changes
  const inputHandler = (event) => {
    setSigninData({ ...signinData, [event.target.name]: event.target.value });
  };

  const navigate = useNavigate();

  // Handle form submission (sign-in request)
  const handleSignIn = () => {
    const { emailid, password } = signinData;
    const userCredentials = { emailid, password };

    axios
      .post('http://localhost:3030/signin', userCredentials)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 'success') {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('userId', response.data.userId);
          sessionStorage.setItem('userName', response.data.name);
          alert('Login successful!');
          navigate('/ProfilePage');
          localStorage.setItem('token', response.data.token);
        } else {
          alert('Error: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        alert('Sign-in failed, please try again!');
      });
  };

  return (
    <div>
      <NavBar/>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-50">
        <h1 className="text-center mb-4">SIGN IN</h1>

        <div className="col-12">
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="emailid" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="emailid"
                value={signinData.emailid}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={signinData.password}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12 text-center">
              <button className="btn btn-success" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
