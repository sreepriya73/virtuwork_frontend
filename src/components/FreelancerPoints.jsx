import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerPoints = () => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch points history, calculate average rating, and total points
  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        if (!userId || !token) {
          navigate("/SignIn");
          return;
        }

        const pointsResponse = await axios.get(
          `http://localhost:3030/tasks/freelancer/${userId}/points-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const history = pointsResponse.data;
        setPointsHistory(history);

        let totalPointsEarned = 0; // Declare here to use later
        if (history.length > 0) {
          const totalRating = history.reduce((sum, entry) => sum + entry.rating, 0);
          const avgRating = totalRating / history.length;
          setAverageRating(avgRating.toFixed(1));

          totalPointsEarned = history.reduce((sum, entry) => sum + entry.rating * 10, 0);
        } else {
          setAverageRating(0);
        }

        // Fetch user data to get total points including redemptions
        const userResponse = await axios.get(`http://localhost:3030/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalPoints(userResponse.data.rewardPoints || totalPointsEarned); // Use declared variable
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch points data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [navigate]);

  // Function to handle points redemption
  const handleRedeemPoints = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        navigate("/SignIn");
        return;
      }

      const pointsToRedeem = parseInt(redeemPoints, 10);
      if (!pointsToRedeem || pointsToRedeem <= 0 || pointsToRedeem > totalPoints) {
        alert("Please enter a valid number of points to redeem.");
        return;
      }

      const cashValue = pointsToRedeem / 10; // 10 points = $1
      const response = await axios.post(
        "http://localhost:3030/redemptions",
        {
          userId,
          pointsRedeemed: pointsToRedeem,
          cashValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Redemption Response:", response.data);
      setTotalPoints((prev) => prev - pointsToRedeem);
      setRedeemPoints("");
      alert(`Successfully redeemed ${pointsToRedeem} points for $${cashValue.toFixed(2)}!`);
    } catch (err) {
      console.error("Error redeeming points:", err);
      alert(err.response?.data?.message || "Failed to redeem points.");
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
    <div className="freelancer-points">
      <NavBar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Your Performance Dashboard</h1>
          <p>Check your ratings and points earned from completed tasks.</p>
        </header>

        <section className="rating-summary">
          <div className="rating-card">
            <h2>Your Average Rating</h2>
            <div className="rating-display">
              <span className="rating-value">{averageRating}</span>
              <span className="rating-max">/ 5</span>
            </div>
            <div className="rating-stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < Math.round(averageRating) ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="rating-text">
              Based on {pointsHistory.length} review{pointsHistory.length !== 1 ? "s" : ""}
            </p>
          </div>
        </section>

        <section className="points-history">
          <div className="history-card">
            <h2>Points History</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {pointsHistory.length === 0 ? (
              <p className="no-data">No points earned yet.</p>
            ) : (
              <table className="points-table">
                <thead>
                  <tr>
                    <th>Task Description</th>
                    <th>Rating</th>
                    <th>Points Earned</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsHistory.map((entry) => (
                    <tr key={entry._id}>
                      <td>{entry.description}</td>
                      <td>{entry.rating} / 5</td>
                      <td>{entry.rating * 10}</td>
                      <td>{new Date(entry.fullyPaidAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="redeem-points">
          <div className="redeem-card">
            <h2>Redeem Your Points</h2>
            <p>Total Available Points: <strong>{totalPoints}</strong> (10 points = $1)</p>
            <input
              type="number"
              className="redeem-input"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              placeholder="Enter points to redeem"
              min="1"
              max={totalPoints}
            />
            <button
              className="btn btn-redeem"
              onClick={handleRedeemPoints}
              disabled={!redeemPoints || totalPoints <= 0}
            >
              Redeem Now
            </button>
          </div>
        </section>

        <div className="back-button-container">
          <button
            className="btn btn-back"
            onClick={() => navigate("/FreelancerDash", { state: { refreshDash: true } })}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .freelancer-points {
          background: linear-gradient(135deg, #f4f7fc 0%, #dfe6ee 100%);
          min-height: 100vh;
          font-family: 'Roboto', 'Arial', sans-serif;
          padding-top: 20px;
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
          width: 50px;
          height: 50px;
          border: 5px solid #1a3c66;
          border-top: 5px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 50px;
          padding: 20px;
          background: linear-gradient(90deg, #1a3c66 0%, #2e5b99 100%);
          border-radius: 15px;
          color: #fff;
          animation: fadeIn 0.5s ease-in;
        }
        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .dashboard-header p {
          font-size: 1.1rem;
          margin: 10px 0 0;
          opacity: 0.9;
        }
        .rating-summary {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
        .rating-card {
          background: linear-gradient(135deg, #fff, #e6f0fa);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          text-align: center;
          transition: transform 0.3s ease;
        }
        .rating-card:hover {
          transform: scale(1.05);
        }
        .rating-card h2 {
          font-size: 1.8rem;
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
        }
        .points-history {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
        .history-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .history-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          margin-bottom: 15px;
        }
        .alert-danger {
          padding: 15px 20px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f8d7da, #f1aeb5);
          color: #721c24;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .points-table {
          width: 100%;
          border-collapse: collapse;
        }
        .points-table th,
        .points-table td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #e6e6e6;
          font-size: 1rem;
          color: #444;
        }
        .points-table th {
          background: linear-gradient(90deg, #e6f0fa, #d9e6f2);
          color: #1a3c66;
          font-weight: 600;
        }
        .points-table tr:hover {
          background: #f9f9f9;
        }
        .no-data {
          font-size: 1.2rem;
          color: #666;
          padding: 20px;
        }
        .redeem-points {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
        .redeem-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .redeem-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          margin-bottom: 15px;
        }
        .redeem-card p {
          font-size: 1.2rem;
          color: #444;
          margin-bottom: 20px;
        }
        .redeem-input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
          margin-bottom: 15px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .redeem-input:focus {
          border-color: #007bff;
        }
        .btn-redeem {
          background: #28a745;
          color: #fff;
          padding: 12px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .btn-redeem:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
        }
        .btn-redeem:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .back-button-container {
          text-align: center;
          margin-top: 30px;
        }
        .btn-back {
          background: linear-gradient(90deg, #007bff, #00aaff);
          color: #fff;
          padding: 12px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .btn-back:hover {
          background: linear-gradient(90deg, #0056b3, #0088cc);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FreelancerPoints;