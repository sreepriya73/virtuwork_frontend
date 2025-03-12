import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({
    emailid: "",
    password: "",
  });

  const navigate = useNavigate();

  const inputHandler = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleLogin = () => {
    const { emailid, password } = loginData;

    axios
      .post("http://localhost:3030/admin/login", { emailid, password })
      .then((response) => {
        if (response.data.status === "success") {
          alert("Admin Login Successful!");
          sessionStorage.setItem("adminToken", response.data.token); // Changed to sessionStorage
          navigate("/AdminDash");
        } else {
          alert("Error: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during admin login:", error);
        alert("Admin Login Failed, please try again!");
      });
  };

  return (
    <div className="admin-login-page">
      <NavBar />
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <div className="form-group">
            <label htmlFor="emailid">Email</label>
            <input
              type="text"
              name="emailid"
              value={loginData.emailid}
              onChange={inputHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={inputHandler}
            />
          </div>
          <div className="button-group">
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          background: linear-gradient(135deg, #e9ecef, #f8f9fa);
          min-height: 100vh;
          font-family: "Arial", sans-serif;
          display: flex;
          flex-direction: column;
        }

        .login-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-card {
          background: #fff;
          border-radius: 15px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
        }

        .login-card h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #343a40;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-group label {
          display: block;
          font-size: 1.1rem;
          color: #343a40;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-group input:focus {
          border-color: #6c757d;
          box-shadow: 0 0 8px rgba(108, 117, 125, 0.2);
        }

        .button-group {
          margin-top: 30px;
        }

        .button-group button {
          background: #6c757d;
          color: #fff;
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .button-group button:hover {
          background: #5a6268;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 30px;
            max-width: 100%;
          }

          .login-card h1 {
            font-size: 1.8rem;
          }

          .form-group input {
            padding: 10px 12px;
            font-size: 0.95rem;
          }

          .button-group button {
            padding: 10px 25px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;