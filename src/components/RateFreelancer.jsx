import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const RateFreelancer = () => {
  const { taskId } = useParams();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/SignIn");
        return;
      }

      const response = await axios.put(
        `http://localhost:3030/tasks/full-payment/${taskId}`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      navigate("/FreelancerDash", { state: { refreshDash: true } }); // Navigate to FreelancerDash
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Rate Freelancer</h2>
        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <p className="text-center">Please rate the freelancer’s work on this task (1-5 stars).</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRatingSubmit}>
            <div className="mb-3 text-center">
              <label className="form-label">Rating:</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      fontSize: "2rem",
                      color: star <= rating ? "#ffc107" : "#e4e5e9",
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || rating === 0}
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
          <button
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate("/FreelancerDash", { state: { refreshDash: true } })}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateFreelancer;