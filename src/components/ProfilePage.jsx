import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

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
        alert("Failed to load user data. Please try again.")
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
      <NavBar/>
    <div className="container mt-5">
      <h1 className="text-center">User Profile</h1>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card p-4 shadow-sm rounded">
            <div className="row">
              {/* Display user profile data */}
              <div className="col-md-6">
                <h6>Username:</h6>
                <p>{userData.username || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Email ID:</h6>
                <p>{userData.emailid || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Phone Number:</h6>
                <p>{userData.phone || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Date of Birth:</h6>
                <p>{userData.dob || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Gender:</h6>
                <p>{userData.gender || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Address:</h6>
                <p>{userData.address || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>District:</h6>
                <p>{userData.district || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>State:</h6>
                <p>{userData.state || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Country:</h6>
                <p>{userData.country || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <h6>Qualification:</h6>
                <p>{userData.qualification || "N/A"}</p>
              </div>
              <div className="col-md-12">
                <h6>Bio:</h6>
                <p>{userData.bio || "N/A"}</p>
              </div>
            </div>
            <div className="text-center mt-4">
             
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default ProfilePage;
