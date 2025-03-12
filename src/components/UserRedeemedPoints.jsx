import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const UserRedeemedPoints = () => {
  const [redeemedPoints, setRedeemedPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        window.location.href = "/SignIn";
        return;
      }

      const userResponse = await axios.get(`http://localhost:3030/users/${userId}`);
      console.log("User Data:", userResponse.data);
      setUserData(userResponse.data);

      const pointsResponse = await axios.get(`http://localhost:3030/redemptions/${userId}`);
      setRedeemedPoints(pointsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.state?.refreshDash]); // Refresh on navigation state change

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="view-redeemed-points">
      <NavBar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Redeemed Reward Points for {userData.username || "User"}</h1>
          <p>View your redemption history below.</p>
        </header>

        <section className="points-summary">
          <div className="summary-card">
            <h2>Current Points</h2>
            <p className="points-value">{userData.rewardPoints || 0} points</p>
            <p className="points-equivalent">(${(userData.rewardPoints / 10) || 0})</p>
            <button
              className="btn btn-redeem"
              onClick={() => navigate("/redeem-points")}
              disabled={(userData.rewardPoints || 0) <= 0}
            >
              Redeem More
            </button>
          </div>
        </section>

        <section className="points-table-section">
          <div className="table-card">
            <h2>Redeemed Points History</h2>
            {redeemedPoints.length === 0 ? (
              <p className="no-data">No redeemed points yet.</p>
            ) : (
              <table className="points-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Points Redeemed</th>
                    <th>Cash Value ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {redeemedPoints.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.redeemedAt).toLocaleDateString()}</td>
                      <td>{entry.pointsRedeemed}</td>
                      <td>${entry.cashValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
        /* Existing styles unchanged */
        .view-redeemed-points {
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

        .dashboard-header p {
          font-size: 1.1rem;
          color: #666;
        }

        .points-summary {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }

        .summary-card {
          background: linear-gradient(135deg, #ffffff, #e6f0fa);
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-5px);
        }

        .summary-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          margin-bottom: 15px;
        }

        .points-value {
          font-size: 2rem;
          font-weight: 700;
          color: #007bff;
          margin-bottom: 5px;
        }

        .points-equivalent {
          font-size: 1.1rem;
          color: #4a6f99;
          margin-bottom: 20px;
        }

        .btn-redeem {
          background: #28a745;
          color: #fff;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-redeem:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-redeem:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }

        .points-table-section {
          display: flex;
          justify-content: center;
        }

        .table-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .table-card:hover {
          transform: translateY(-5px);
        }

        .table-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          text-align: center;
          margin-bottom: 20px;
        }

        .no-data {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
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
        }

        .points-table th {
          background: #e6f0fa;
          color: #1a3c66;
          font-weight: 600;
        }

        .points-table tr:hover {
          background: #f9f9f9;
        }

        .points-table td {
          color: #666;
        }

        .back-button-container {
          text-align: center;
          margin-top: 40px;
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
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-back:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 2rem;
          }

          .summary-card,
          .table-card {
            padding: 20px;
          }

          .summary-card h2,
          .table-card h2 {
            font-size: 1.5rem;
          }

          .points-value {
            font-size: 1.8rem;
          }

          .points-table th,
          .points-table td {
            padding: 10px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserRedeemedPoints;