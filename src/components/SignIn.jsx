import axios from "axios";
import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [signinData, setSigninData] = useState({
    emailid: "",
    password: "",
  });

  const navigate = useNavigate();

  const inputHandler = (event) => {
    setSigninData({ ...signinData, [event.target.name]: event.target.value });
  };

  const handleSignIn = () => {
    const { emailid, password } = signinData;
    const userCredentials = { emailid, password };

    axios
      .post("http://localhost:3030/signin", userCredentials)
      .then((response) => {
        console.log("Sign-in response:", response.data);
        if (response.data.status === "success") {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("userId", response.data.userId);
          sessionStorage.setItem("userName", response.data.username);
          alert("Login successful!");

          const role = response.data.role ? response.data.role.toLowerCase() : null;
          if (role === "client") {
            navigate("/ClientDash");
          } else if (role === "freelancer") {
            navigate("/FreelancerDash");
          } else {
            alert("Invalid role detected: " + (response.data.role || "No role provided"));
          }
        } else {
          alert("Error: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        alert("Sign-in failed, please try again!");
      });
  };

  return (
    <div className="signin-page">
      <NavBar />
      <div className="signin-container">
        <div className="signin-card">
          <h1>Sign In</h1>
          <div className="form-group">
            <label htmlFor="emailid">Email</label>
            <input
              type="text"
              name="emailid"
              value={signinData.emailid}
              onChange={inputHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={signinData.password}
              onChange={inputHandler}
            />
          </div>
          <div className="button-group">
            <button onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .signin-page {
          background: linear-gradient(135deg, #e6f0fa, #f4f7fc);
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .signin-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .signin-card {
          background: #fff;
          border-radius: 15px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .signin-card:hover {
          transform: translateY(-5px);
        }

        .signin-card h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a3c66;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-group label {
          display: block;
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-group input:focus {
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
        }

        .button-group {
          margin-top: 30px;
        }

        .button-group button {
          background: #007bff;
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
          background: #0056b3;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .signin-card {
            padding: 30px;
            max-width: 100%;
          }

          .signin-card h1 {
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

export default SignIn;