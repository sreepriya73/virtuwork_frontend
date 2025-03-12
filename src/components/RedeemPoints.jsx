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
        console.log("Fetched Points:", response.data.rewardPoints);
        setPoints(response.data.rewardPoints || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch points");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [navigate]);

  const handleRedeem = async (e) => {
    e.preventDefault();

    const pointsNum = parseInt(pointsToRedeem, 10);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      setError("Please enter a valid number of points.");
      return;
    }
    if (pointsNum > points) {
      setError("Insufficient points to redeem.");
      return;
    }
    if (pointsNum % 10 !== 0) {
      setError("Points must be redeemed in multiples of 10 (e.g., 10, 20, 30).");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/SignIn");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3030/users/redeem-points",
        { pointsToRedeem: pointsNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setPoints(response.data.remainingPoints);
      setPointsToRedeem("");
      navigate("/FreelancerDash", { state: { refreshDash: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to redeem points");
    } finally {
      setLoading(false);
    }
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
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Redeem Reward Points</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <h4 className="text-center">Your Points</h4>
          <p className="text-center">
            <strong>Total Points:</strong> {points} (10 points = $1)
          </p>
          <p className="text-center">
            <strong>Cash Value:</strong> ${(points / 10).toFixed(2)}
          </p>

          <form onSubmit={handleRedeem}>
            <div className="mb-3">
              <label htmlFor="pointsToRedeem" className="form-label">
                Points to Redeem (multiples of 10)
              </label>
              <input
                type="number"
                className="form-control"
                id="pointsToRedeem"
                value={pointsToRedeem}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*$/.test(value)) {
                    setPointsToRedeem(value);
                  }
                }}
                placeholder="e.g., 20"
                min="10"
                max={points}
                step="10"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || points < 10}
            >
              {loading ? "Redeeming..." : "Redeem Points"}
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
      {/* CSS unchanged */}
    </div>
  );
};

export default RedeemPoints;