import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';


const HomePage = () => {
  const [data, setData] = useState({
    emailid: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    setLoginError("");
  };

  const validateFields = () => {
    const errors = {};

    if (!data.emailid) {
      errors.emailid = "Email ID is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.emailid)) {
        errors.emailid = "Invalid email format.";
      }
    }

    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const readValue = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post('http://localhost:3030/signin', data)
      .then((response) => {
        if (response.data.status === 'success') {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('userId', response.data.userId);
          navigate('/ProfilePage');
        } else {
          setLoginError('Incorrect email or password. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
      });
  };

  return (
    <div>
     <NavBar/>

      {/* Hero Section with Login Form */}
      <div className="hero-section">
        <img
          src="https://fireflies.ai/blog/content/images/size/w2000/2021/06/image3.jpg"
          className="bg-image"
          alt="Banner"
        />
        <div className="login-overlay">
          <h2 className="login-title">SIGN IN</h2>
          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="emailid"
                value={data.emailid}
                onChange={inputHandler}
              />
              {errors.emailid && <small className="text-danger">{errors.emailid}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={data.password}
                onChange={inputHandler}
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            {loginError && <small className="text-danger">{loginError}</small>}
            <button className="btn btn-success" onClick={readValue}>LOGIN</button>
            <div className="additional-links">
              <a href="/register">New User?</a> | <a href="/AdminLogin">Admin login</a>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>Welcome to our platform! We provide convenient and easy-to-use services for all your needs. 
          Our team is committed to ensuring a smooth user experience and high-quality support.</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Your Company Name. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        .hero-section {
          position: relative;
          text-align: center;
          margin-bottom: 50px;
        }
        
        .bg-image {
          width: 100%;
          height: 100vh;
          object-fit: cover;
        }

        .login-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(255, 255, 255, 0.9);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 90%;
        }

        .login-title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          text-align: left;
        }

        .btn-success {
          background-color: #28a745;
          border: none;
          padding: 10px;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
        }

        .additional-links {
          margin-top: 15px;
          font-size: 14px;
        }

        .about-section {
          text-align: center;
          margin: 50px auto;
          padding: 20px;
          max-width: 800px;
        }

        .about-section h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          margin-top: 50px;
        }

        .footer-links {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .footer-links a {
          color: #333;
          text-decoration: none;
          margin: 0 10px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
