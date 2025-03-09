import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (!userId || !token) {
          navigate("/SignIn");
          return;
        }

        const response = await axios.get(`http://localhost:3030/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPoints(response.data.rewardPoints || 0);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch points");
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [navigate]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!pointsToRedeem || pointsToRedeem <= 0) {
      setError("Please enter a valid number of points.");
      return;
    }
    if (pointsToRedeem > points) {
      setError("Insufficient points to redeem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3030/users/redeem-points",
        { pointsToRedeem: parseInt(pointsToRedeem) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setPoints(response.data.remainingPoints);
      setPointsToRedeem("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to redeem points");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Redeem Reward Points</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <h4 className="text-center">Your Points</h4>
          <p className="text-center"><strong>Total Points:</strong> {points} (10 points = $1)</p>
          <p className="text-center"><strong>Cash Value:</strong> ${(points / 10).toFixed(2)}</p>

          <form onSubmit={handleRedeem}>
            <div className="mb-3">
              <label htmlFor="pointsToRedeem" className="form-label">Points to Redeem</label>
              <input
                type="number"
                className="form-control"
                id="pointsToRedeem"
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(e.target.value)}
                placeholder="Enter points (e.g., 20)"
                min="1"
                max={points}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || points <= 0}
            >
              {loading ? "Redeeming..." : "Redeem Points"}
            </button>
          </form>
          <button
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate("/FreelancerDash")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;