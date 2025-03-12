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
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setLoginError("");
  };

  const validateFields = () => {
    const errors = {};

    // Email validation
    if (!data.emailid) {
      errors.emailid = "Email is required.";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.emailid)) {
        errors.emailid = "Please enter a valid email (e.g., user@example.com).";
      }
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required.";
    } else {
      if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(data.password)) {
        errors.password = "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(data.password)) {
        errors.password = "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(data.password)) {
        errors.password = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*]/.test(data.password)) {
        errors.password = "Password must contain at least one special character (e.g., !@#$%^&*).";
      }
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
          sessionStorage.setItem('userName', response.data.username);
          alert('Login successful!');
          
          if (response.data.role && response.data.role.toLowerCase() === 'client') {
            navigate('/ClientDash');
          } else {
            navigate('/FreelancerDash');
          }
        } else {
          setLoginError(response.data.message || 'Login failed.');
        }
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        setLoginError('Sign-in failed. Please check your credentials and try again.');
      });
  };

  return (
    <div>
      <NavBar />

      {/* Hero Section with Login Form */}
      <section className="hero-section">
        <img
          src="https://fireflies.ai/blog/content/images/size/w2000/2021/06/image3.jpg"
          className="bg-image"
          alt="Background"
        />
        <div className="hero-overlay"></div>
        <div className="login-container">
          <div className="login-card">
            <h2 className="login-title">Sign In to VIRTUWORK</h2>
            <p className="login-subtitle">Access your account and start collaborating!</p>
            <form className="login-form" onSubmit={(e) => { e.preventDefault(); readValue(); }}>
              <div className="form-group">
                <label htmlFor="emailid" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.emailid ? 'is-invalid' : ''}`}
                  name="emailid"
                  value={data.emailid}
                  onChange={inputHandler}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.emailid && <small className="error-text">{errors.emailid}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={data.password}
                  onChange={inputHandler}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {errors.password && <small className="error-text">{errors.password}</small>}
              </div>
              {loginError && <div className="login-error">{loginError}</div>}
              <button type="submit" className="btn-login">Login</button>
              <div className="additional-links">
                <a href="/UserRegister" className="link">New User? Register</a>
                <span className="separator"> | </span>
                <a href="/AdminLogin" className="link">Admin Login</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-content">
          <h2 className="section-title">About Us</h2>
          <p className="section-text">
            Welcome to VIRTUWORK, your premier platform for connecting freelancers and clients worldwide. 
            We’re dedicated to delivering seamless collaboration, top-notch services, and a user-friendly experience. 
            Join us to unlock endless opportunities!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2024 VIRTUWORK. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <span> | </span>
          <a href="/terms" className="footer-link">Terms of Service</a>
        </div>
      </footer>

      {/* Enhanced CSS */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4); /* Dark overlay for contrast */
          z-index: -1;
        }

        .login-container {
          max-width: 450px;
          width: 100%;
          padding: 0 20px;
          z-index: 1;
        }

        .login-card {
          background: #e6f0fa; /* Changed to soft light blue */
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a3c66; /* Darker blue for contrast */
          text-align: center;
          margin-bottom: 10px;
        }

        .login-subtitle {
          font-size: 1rem;
          color: #4a6f99; /* Medium blue for subtitle */
          text-align: center;
          margin-bottom: 25px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          text-align: left;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a3c66; /* Darker blue for labels */
          margin-bottom: 5px;
          display: block;
        }

        .form-control {
          width: 100%;
          padding: 12px 15px;
          font-size: 1rem;
          border: 2px solid #b3cce6; /* Lighter blue border */
          border-radius: 8px;
          background: #fff; /* White input background for contrast */
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          outline: none;
        }

        .form-control.is-invalid {
          border-color: #dc3545;
        }

        .error-text {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 5px;
          display: block;
        }

        .login-error {
          color: #dc3545;
          font-size: 0.9rem;
          text-align: center;
          margin-top: -10px;
          margin-bottom: 15px;
        }

        .btn-login {
          background: linear-gradient(90deg, #007bff, #00c4cc);
          border: none;
          padding: 12px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }

        .additional-links {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9rem;
          color: #4a6f99; /* Medium blue for links text */
        }

        .link {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .link:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .separator {
          margin: 0 10px;
        }

        .about-section {
          padding: 60px 20px;
          background: #f8f9fa;
          text-align: center;
        }

        .about-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
        }

        .section-text {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
        }

        .footer {
          background: #333;
          color: #fff;
          padding: 30px 20px;
          text-align: center;
        }

        .footer-text {
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .footer-links {
          font-size: 0.85rem;
        }

        .footer-link {
          color: #ccc;
          text-decoration: none;
          margin: 0 10px;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #fff;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 30px;
          }

          .login-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;