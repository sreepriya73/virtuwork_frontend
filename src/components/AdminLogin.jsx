import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({
    emailid: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const inputHandler = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  // Handle admin login submission
  const handleLogin = () => {
    const { emailid, password } = loginData;

    axios
      .post('http://localhost:3030/admin/login', { emailid, password })
      .then((response) => {
        if (response.data.status === 'success') {
          alert('Admin Login Successful!');
          localStorage.setItem('adminToken', response.data.token); // Save token in localStorage
          navigate('/AdminDashboard'); // Redirect to the admin dashboard
        } else {
          alert('Error: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error during admin login:', error);
        alert('Admin Login Failed, please try again!');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-50">
        <h1 className="text-center mb-4">Admin Login</h1>
        <div className="col-12">
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="emailid" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="emailid"
                value={loginData.emailid}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={loginData.password}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12 text-center">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
