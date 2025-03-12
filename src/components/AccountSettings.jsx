import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    username: "",
    emailid: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (!userId || !token) {
          navigate("/SignIn");
          return;
        }

        const response = await axios.get(`http://localhost:3030/uusers/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          username: response.data.username || "",
          emailid: response.data.emailid || "",
          phone: response.data.phone || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        navigate("/SignIn");
        return;
      }

      const response = await axios.put(
        `http://localhost:3030/uusers/${userId}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.setItem("userName", userData.username);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        navigate("/SignIn");
        return;
      }

      await axios.delete(`http://localhost:3030/uusers/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sessionStorage.clear();
      alert("Account deleted successfully!");
      navigate("/SignIn");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      console.error("Error deleting account:", err);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
  if (error) return (
    <div className="error-container">
      <h2>Error</h2>
      <p className="error-message">{error}</p>
    </div>
  );

  return (
    <div className="account-settings-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>Account Settings</h2>
        </header>
        <div className="settings-card">
          <section className="edit-profile">
            <h4>Edit Profile</h4>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emailid">Email</label>
                <input
                  type="email"
                  id="emailid"
                  name="emailid"
                  value={userData.emailid}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <button type="submit" className="update-btn">Update Profile</button>
            </form>
          </section>

          <hr />

          <section className="delete-account">
            <h4>Delete Account</h4>
            <p>Deleting your account will remove all your data permanently.</p>
            <button onClick={handleDeleteAccount} className="delete-btn">Delete My Account</button>
          </section>
        </div>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .account-settings-page {
          background: linear-gradient(135deg, #e6f0fa, #f4f7fc);
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a3c66;
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f4f7fc;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #1a3c66;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-container h2 {
          font-size: 1.8rem;
          color: #dc3545;
          margin-bottom: 10px;
        }

        .error-message {
          font-size: 1.1rem;
          color: #dc3545;
        }

        .settings-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .settings-card:hover {
          transform: translateY(-5px);
        }

        .edit-profile h4,
        .delete-account h4 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a3c66;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
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

        .update-btn,
        .delete-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .update-btn {
          background: #007bff;
          color: #fff;
          margin-top: 20px;
        }

        .update-btn:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        hr {
          border: 0;
          border-top: 1px solid #ddd;
          margin: 30px 0;
        }

        .delete-account p {
          font-size: 1rem;
          color: #666;
          margin-bottom: 20px;
        }

        .delete-btn {
          background: #dc3545;
          color: #fff;
        }

        .delete-btn:hover {
          background: #b02a37;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .header h2 {
            font-size: 1.8rem;
          }

          .settings-card {
            padding: 20px;
          }

          .edit-profile h4,
          .delete-account h4 {
            font-size: 1.3rem;
          }

          .form-group input {
            padding: 10px 12px;
            font-size: 0.95rem;
          }

          .update-btn,
          .delete-btn {
            padding: 10px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountSettings;