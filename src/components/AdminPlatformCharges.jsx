import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const AdminPlatformCharges = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlatformCharges = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/platform-charges");
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch platform charges");
        console.error("Error fetching platform charges:", err);
        setLoading(false);
      }
    };

    fetchPlatformCharges();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return (
    <div className="container mt-5">
      <h2 className="text-center">Error</h2>
      <p className="text-center text-danger">{error}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Platform Charges Overview</h2>
        {tasks.length === 0 ? (
          <p className="text-center">No platform charges recorded.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Task ID</th>
                  <th>Description</th>
                  <th>Client Name</th>
                  <th>Freelancer Name</th>
                  <th>Total Budget</th>
                  <th>Half Payment Charge</th>
                  <th>Full Payment Charge</th>
                  <th>Total Charge</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task._id}</td>
                    <td>{task.description}</td>
                    <td>{task.ClientId?.username || "N/A"}</td>
                    <td>{task.freelancerId?.username || "N/A"}</td>
                    <td>${task.budget}</td>
                    <td>${task.halfPaymentPlatformCharge.toFixed(2)}</td>
                    <td>${task.fullPaymentPlatformCharge.toFixed(2)}</td>
                    <td>${(task.halfPaymentPlatformCharge + task.fullPaymentPlatformCharge).toFixed(2)}</td>
                    <td>{task.paymentStatus}</td>
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

export default AdminPlatformCharges;