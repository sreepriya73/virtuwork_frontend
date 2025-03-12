import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const ClientDash = () => {
  const [userData, setUserData] = useState({});
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        if (!userId || !token) {
          window.location.href = "/SignIn";
          return;
        }

        console.log("Fetching user data for:", userId);
        const userResponse = await axios.get(`http://localhost:3030/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User Response:", userResponse.data);
        setUserData(userResponse.data);

        if (userResponse.data.role !== "Client") {
          setError("Only clients can access this dashboard.");
          return;
        }

        console.log("Fetching all users");
        const allUsersResponse = await axios.get(`http://localhost:3030/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("All Users Response:", allUsersResponse.data);
        const freelancerIds = allUsersResponse.data
          .filter(user => user.role === "Freelancer")
          .map(user => user._id);
        console.log("Freelancer IDs:", freelancerIds);

        const freelancerProfiles = await Promise.all(
          freelancerIds.map(id => {
            console.log(`Fetching profile for ID: ${id}`);
            return axios.get(`http://localhost:3030/freelancers/${id}/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          })
        );
        const profiles = freelancerProfiles.map(res => res.data);
        console.log("Freelancer Profiles:", profiles);

        const validFreelancers = profiles.filter(f => f._id && typeof f._id === "string");
        if (validFreelancers.length < profiles.length) {
          console.warn("Some freelancers missing valid _id:", profiles.filter(f => !f._id));
        }

        const sortedFreelancers = validFreelancers.sort((a, b) => b.averageRating - a.averageRating);
        setFreelancers(sortedFreelancers);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response:", error.response?.data);
        setError(error.response?.data?.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewProfile = (freelancerId) => {
    if (!freelancerId || freelancerId === "undefined") {
      console.error("Invalid freelancerId:", freelancerId);
      setError("Cannot view profile: Invalid freelancer ID.");
      return;
    }
    navigate(`/freelancers/${freelancerId}/profile`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="client-dash">
      <NavBar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>
            Welcome, {userData.username || "User"} <span>({userData.role || "N/A"})</span>
          </h1>
          <p>Your hub for managing tasks and projects.</p>
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
              <button className="btn btn-settings" onClick={() => navigate("/account-settings")}>
                Account Settings
              </button>
              <button
                className="btn btn-logout"
                onClick={() => {
                  sessionStorage.clear();
                  alert("Logged out successfully!");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-actions">
          <div className="action-card" onClick={() => navigate("/AddTask")}>
            <h3>Assign Task</h3>
            <p>Quickly assign tasks to team members with ease.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/ConfirmedTasks")}>
            <h3>Confirmed Tasks</h3>
            <p>View confirmed tasks and process payments.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/client-task-list")}>
            <h3>View Task Progress</h3>
            <p>View the live progress.</p>
            <button className="btn btn-action">Go</button>
          </div>
          <div className="action-card" onClick={() => navigate("/ViewSubmittedWorks")}>
            <h3>Completed Tasks</h3>
            <p>Review and manage completed tasks.</p>
            <button className="btn btn-action">Go</button>
          </div>
         
          
        </section>

        
      </div>

      <style jsx>{`
        .client-dash {
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
        }
        .dashboard-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
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
        .btn {
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
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
        .freelancers-section {
          margin-top: 50px;
        }
        .freelancers-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a3c66;
          text-align: center;
          margin-bottom: 30px;
        }
        .freelancers-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .freelancer-card {
          background: #fff;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .freelancer-card:hover {
          transform: translateY(-5px);
        }
        .freelancer-info h3 {
          font-size: 1.5rem;
          color: #1a3c66;
          margin-bottom: 10px;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rating-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #007bff;
        }
        .rating-max {
          font-size: 1rem;
          color: #4a6f99;
        }
        .rating-stars {
          display: flex;
          gap: 2px;
        }
        .star {
          font-size: 1.2rem;
          color: #e4e5e9;
        }
        .star.filled {
          color: #ffc107;
        }
        .review-count {
          font-size: 0.9rem;
          color: #666;
        }
        .btn-view-profile {
          background: #28a745;
          color: #fff;
          padding: 8px 20px;
        }
        .btn-view-profile:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }
        .no-freelancers {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
        }
        .alert-danger {
          padding: 15px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
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
          .freelancer-card {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          .rating {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDash;