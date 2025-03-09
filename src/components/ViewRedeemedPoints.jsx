import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const ViewRedeemedPoints = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const response = await axios.get("http://localhost:3030/redemptions");
        setRedemptions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch redeemed points");
        console.error("Error fetching redemptions:", err);
        setLoading(false);
      }
    };

    fetchRedemptions();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Error</h2>
        <p className="text-center text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Redeemed Points History</h2>
        {redemptions.length === 0 ? (
          <p className="text-center">No redeemed points found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Redemption ID</th>
                  <th>Freelancer ID</th>
                  <th>Freelancer Name</th>
                  <th>Client ID</th>
                  <th>Client Name</th>
                  <th>Task Description</th>
                  <th>Points Redeemed</th>
                  <th>Cash Value</th>
                  <th>Redeemed At</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((redemption) => (
                  <tr key={redemption._id}>
                    <td>{redemption._id}</td>
                    <td>{redemption.userId?._id || "N/A"}</td>
                    <td>{redemption.userId?.username || "N/A"}</td>
                    <td>{redemption.taskId?.ClientId?._id || "N/A"}</td>
                    <td>{redemption.taskId?.ClientId?.username || "N/A"}</td>
                    <td>{redemption.taskId?.description || "Not tied to a specific task"}</td>
                    <td>{redemption.pointsRedeemed}</td>
                    <td>${redemption.cashValue.toFixed(2)}</td>
                    <td>{new Date(redemption.redeemedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRedeemedPoints;