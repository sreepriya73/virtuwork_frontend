import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId"); // Fetch user ID from session storage
        if (!userId) {
          window.location.href = "/SignIn"; // Redirect to login if userId is missing
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
          Welcome, {userData.username || "User"} ({userData.role || "N/A"})!
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
                    sessionStorage.clear(); // Clear session and logout
                    alert("Logged out successfully!");
                    window.location.href = "/HomePage"; // Redirect to login page
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
              <h5>Assign Task</h5>
              <p className="text-muted">
                Quickly assign tasks to team members with ease.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/AddTask")} // Navigate to the Assign Task page
              >
                Assign Task
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
