import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerDash = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        window.location.href = "/SignIn";
        return;
      }

      const response = await axios.get(`http://localhost:3030/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      console.log("Fetched User Data:", response.data);
      if (response.data.role !== "Freelancer") {
        navigate("/SignIn");
        return;
      }
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [location.state?.refreshDash]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="freelancer-dash">
      <NavBar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>
            Welcome, {userData.username || "User"} <span>({userData.role || "Freelancer"})</span>
          </h1>
          <p>Your hub for managing tasks and earnings.</p>
        </header>

        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </div>
              <h2>Profile</h2>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Username:</span>
                <span>{userData.username || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span>{userData.emailid || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span>{userData.phone || "N/A"}</span>
              </div>
              
            </div>
            <div className="profile-actions">
              <button
                className="btn btn-settings"
                onClick={() => navigate("/account-settings")}
              >
                Account Settings
              </button>
              <button
                className="btn btn-logout"
                onClick={() => {
                  sessionStorage.clear();
                  alert("Logged out successfully!");
                  window.location.href = "/SignIn";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-actions">
          <div className="action-card" onClick={() => navigate("/ConfirmTask")}>
            <h3>Confirm Tasks</h3>
            <p>Manage and confirm your assigned tasks.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/TaskProgress")}>
            <h3>Task Progress</h3>
            <p>Find task progress of current work.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/freelancer-work-history")}>
            <h3>Work History</h3>
            <p>View your completed tasks and payments.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/TaskRecommender")}>
            <h3>Task Recommender</h3>
            <p>Find tasks tailored to your skills.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/freelancer-points")}>
            <h3>Reward Points</h3>
            <p>View and redeem your reward points.</p>
            <button className="btn btn-action">Go</button>
          </div>
        </section>
      </div>

      {/* CSS unchanged */}
      <style jsx>{`
        .freelancer-dash {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
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
          border: 4px solid #007bff;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a3c66;
          margin-bottom: 10px;
        }
        .dashboard-header h1 span {
          font-size: 1.2rem;
          color: #4a6f99;
          font-weight: 400;
        }
        .dashboard-header p {
          font-size: 1.1rem;
          color: #666;
        }
        .profile-section {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
        .profile-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .profile-card:hover {
          transform: translateY(-5px);
        }
        .profile-header {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-bottom: 20px;
        }
        .avatar {
          width: 60px;
          height: 60px;
          background: #007bff;
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 15px;
        }
        .profile-header h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          font-weight: 600;
        }
        .profile-details {
          margin-bottom: 20px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e6e6e6;
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #4a6f99;
        }
        .profile-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-settings {
          background: #17a2b8;
          color: #fff;
        }
        .btn-settings:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
        }
        .btn-logout {
          background: #dc3545;
          color: #fff;
        }
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }
        .dashboard-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .action-card {
          background: linear-gradient(135deg, #ffffff, #e6f0fa);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .action-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        .action-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a3c66;
          margin-bottom: 10px;
        }
        .action-card p {
          font-size: 1rem;
          color: #666;
          margin-bottom: 20px;
        }
        .btn-action {
          background: #007bff;
          color: #fff;
          padding: 10px 25px;
        }
        .btn-action:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }
        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 2rem;
          }
          .profile-card {
            padding: 20px;
          }
          .profile-header h2 {
            font-size: 1.5rem;
          }
          .action-card {
            padding: 20px;
          }
          .action-card h3 {
            font-size: 1.3rem;
          }
          .profile-actions {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default FreelancerDash;