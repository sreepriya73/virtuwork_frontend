import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const ViewRedeemedPoints = () => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPointsData = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");

        if (!token) {
          navigate("/AdminLogin");
          return;
        }

        const pointsResponse = await axios.get(
          "http://localhost:3030/tasks/all-points-history",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPointsHistory(pointsResponse.data);

        const redemptionResponse = await axios.get(
          "http://localhost:3030/redemptions/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRedemptions(redemptionResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch points data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPointsData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="freelancer-points-view">
      <NavBar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin: All Freelancers Points Dashboard</h1>
          <p>View earned points, task details, and redemption history for all freelancers.</p>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}

        <section className="points-history">
          <div className="history-card">
            <h2>Points Earned History</h2>
            {pointsHistory.length === 0 ? (
              <p className="no-data">No points earned yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="points-table">
                  <thead>
                    <tr>
                      <th>Freelancer</th>
                      <th>Task Description</th>
                      <th>Client</th>
                      <th>Category</th>
                      <th>Rating</th>
                      <th>Points Earned</th>
                      <th>Completed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsHistory.map((entry) => (
                      <tr key={entry._id}>
                        <td>{entry.freelancerId?.username || "N/A"}</td>
                        <td>{entry.description}</td>
                        <td>{entry.ClientId?.username || "N/A"}</td>
                        <td>{entry.category}</td>
                        <td>{entry.rating} / 5</td>
                        <td>{entry.rating * 10}</td>
                        <td>{new Date(entry.fullyPaidAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* New Section for Redeemed Points */}
        <section className="redemptions-history">
          <div className="history-card">
            <h2>Redeemed Points History</h2>
            {redemptions.length === 0 ? (
              <p className="no-data">No points redeemed yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="points-table">
                  <thead>
                    <tr>
                      <th>Freelancer</th>
                      <th>Points Redeemed</th>
                      <th>Cash Value ($)</th>
                      <th>Redeemed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map((redemption) => (
                      <tr key={redemption._id}>
                        <td>{redemption.userId?.username || "N/A"}</td>
                        <td>{redemption.pointsRedeemed}</td>
                        <td>{redemption.cashValue.toFixed(2)}</td>
                        <td>{new Date(redemption.redeemedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <div className="back-button-container">
          <button className="btn btn-back" onClick={() => navigate("/AdminDash")}>
            Back to Admin Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .freelancer-points-view {
          background: linear-gradient(135deg, #f4f7fc 0%, #dfe6ee 100%);
          min-height: 100vh;
          font-family: "Roboto", "Arial", sans-serif;
          padding-top: 20px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
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

        .alert-danger {
          padding: 15px 20px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f8d7da, #f1aeb5);
          color: #721c24;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 30px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        .points-history,
        .redemptions-history {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }

        .history-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 1000px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeInUp 0.5s ease-out;
        }

        .history-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          margin-bottom: 20px;
        }

        .no-data {
          font-size: 1.2rem;
          color: #666;
          padding: 20px;
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .points-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
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

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 2rem;
          }
          .dashboard-header p {
            font-size: 1rem;
          }
          .history-card {
            padding: 20px;
          }
          .points-table th,
          .points-table td {
            padding: 10px;
            font-size: 0.9rem;
          }
          .btn-back {
            padding: 10px 20px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewRedeemedPoints;