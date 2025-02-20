import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    emailid: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const inputHandler = (event) => {
    setRegisterData({ ...registerData, [event.target.name]: event.target.value });
  };

  // Handle registration form submission
  const handleRegister = () => {
    const { name, emailid, password } = registerData;

    axios
      .post('http://localhost:3030/admin/register', { name, emailid, password })
      .then((response) => {
        if (response.data.status === 'success') {
          alert('Admin registered successfully!');
          navigate('/AdminLogin'); // Redirect to the login page
        } else {
          alert('Error: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error during admin registration:', error);
        alert('Registration failed, please try again!');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-50">
        <h1 className="text-center mb-4">Admin Registration</h1>
        <div className="col-12">
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={registerData.name}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12">
              <label htmlFor="emailid" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="emailid"
                value={registerData.emailid}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={registerData.password}
                onChange={inputHandler}
              />
            </div>
            <div className="col-12 text-center">
              <button className="btn btn-primary" onClick={handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
