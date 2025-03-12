import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerProfile = () => {
  const { freelancerId } = useParams();
  const [profile, setProfile] = useState({
    username: "",
    emailid: "",
    phone: "",
    averageRating: 0, // Placeholder until you add rating logic
    reviewCount: 0,   // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        console.log("Client User ID:", userId);
        console.log("Freelancer ID from URL:", freelancerId);

        if (!userId) {
          console.log("No userId, redirecting to SignIn");
          navigate("/SignIn");
          return;
        }

        if (!freelancerId || freelancerId === "undefined") {
          console.error("Invalid freelancerId:", freelancerId);
          setError("Invalid freelancer ID. Please select a valid freelancer.");
          setLoading(false);
          return;
        }

        // Fetch freelancer data
        const response = await axios.get(`http://localhost:3030/cusers/${freelancerId}`);
        console.log("Profile Response:", response.data);
        if (response.data.role !== "Freelancer") {
          setError("This user is not a freelancer.");
          setLoading(false);
          return;
        }

        // For now, set basic data; add rating logic below if needed
        setProfile({
          username: response.data.username,
          emailid: response.data.emailid,
          phone: response.data.phone,
          averageRating: 0, // Update this with actual rating logic
          reviewCount: 0,   // Update this with actual review count
        });

        // If you have a separate endpoint for ratings (e.g., /freelancers/:id/profile), add it here:
        // const ratingResponse = await axios.get(`http://localhost:3030/freelancers/${freelancerId}/profile`);
        // setProfile(prev => ({ ...prev, averageRating: ratingResponse.data.averageRating, reviewCount: ratingResponse.data.reviewCount }));
      } catch (err) {
        console.error("Error fetching freelancer profile:", err);
        console.error("Error response:", err.response?.data);
        setError(err.response?.data?.error || "Failed to fetch freelancer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [freelancerId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="freelancer-profile">
      <NavBar />
      <div className="profile-container">
        <header className="profile-header">
          <h1>Freelancer Profile</h1>
          <p>Learn more about this freelancer’s performance.</p>
        </header>

        {error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <section className="profile-details">
            <div className="profile-card">
              <div className="avatar">
                {profile.username ? profile.username[0].toUpperCase() : "F"}
              </div>
              <h2>{profile.username || "Unknown Freelancer"}</h2>
              <div className="rating-display">
                <span className="rating-value">{profile.averageRating}</span>
                <span className="rating-max">/ 5</span>
              </div>
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${index < Math.round(profile.averageRating) ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="rating-text">
                Based on {profile.reviewCount} review{profile.reviewCount !== 1 ? "s" : ""}
              </p>
              <div className="details-list">
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span>{profile.emailid || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span>{profile.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="back-button-container">
          <button
            className="btn btn-back"
            onClick={() => navigate("/ClientDash", { state: { refreshDash: true } })}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .freelancer-profile {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }
        .profile-container {
          max-width: 800px;
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
        .profile-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .profile-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a3c66;
        }
        .profile-header p {
          font-size: 1.1rem;
          color: #666;
        }
        .profile-details {
          display: flex;
          justify-content: center;
        }
        .profile-card {
          background: linear-gradient(135deg, #fff, #e6f0fa);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          text-align: center;
          transition: transform 0.3s ease;
        }
        .profile-card:hover {
          transform: scale(1.05);
        }
        .avatar {
          width: 80px;
          height: 80px;
          background: #007bff;
          color: #fff;
          font-size: 2.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 20px;
        }
        .profile-card h2 {
          font-size: 2rem;
          color: #1a3c66;
          margin-bottom: 20px;
        }
        .rating-display {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 15px;
        }
        .rating-value {
          font-size: 4rem;
          font-weight: 700;
          color: #007bff;
          line-height: 1;
        }
        .rating-max {
          font-size: 1.5rem;
          color: #4a6f99;
          margin-left: 10px;
        }
        .rating-stars {
          margin-bottom: 15px;
        }
        .star {
          font-size: 2.5rem;
          color: #e4e5e9;
          transition: color 0.3s ease;
        }
        .star.filled {
          color: #ffc107;
        }
        .rating-text {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 20px;
        }
        .details-list {
          text-align: left;
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
        .btn-back {
          background: #007bff;
          color: #fff;
          padding: 10px 25px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: block;
          margin: 0 auto;
        }
        .btn-back:hover {
          background: #0056b3;
        }
        .alert-danger {
          padding: 15px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default FreelancerProfile;