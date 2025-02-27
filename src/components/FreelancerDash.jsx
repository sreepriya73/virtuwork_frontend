import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerDashboard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          window.location.href = "/SignIn";
          return;
        }

        const response = await axios.get(`http://localhost:3030/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        {/* Welcome message */}
        <h2 className="text-center mb-4">
          Welcome, {userData.username || "User"} ({userData.role || "Freelancer"})!
        </h2>

        {/* Profile Information */}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg rounded">
              <h4 className="text-center">Profile</h4>
              <div className="mt-3">
                <h6>Username:</h6>
                <p>{userData.username || "N/A"}</p>
              </div>
              <div>
                <h6>Email ID:</h6>
                <p>{userData.emailid || "N/A"}</p>
              </div>
              <div>
                <h6>Phone Number:</h6>
                <p>{userData.phone || "N/A"}</p>
              </div>
              <div className="text-center mt-4">
                <button
                  className="btn btn-danger"
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
          </div>
        </div>

        {/* Task Options */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div
              className="card p-4 shadow-lg rounded text-center"
              style={{
                backgroundColor: "#f9f9f9",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h5>View Tasks</h5>
              <p className="text-muted">Manage and view all your assigned tasks easily.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/tasks")}
              >
                View Tasks
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="card p-4 shadow-lg rounded text-center"
              style={{
                backgroundColor: "#f9f9f9",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
 <h5>Customize Task</h5>
              <p className="text-muted">
                Create and customize tasks based on specific requirements.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/customize-task")} // Navigate to the Customize Task page
              >
                Customize Task
              </button>

              <h5>Submit Work</h5>
              <p className="text-muted">Upload and submit your completed work efficiently.</p>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/submit-work")}
              >
                Submit Work
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
