import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const AdminAllPayments = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/all");
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payment history");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
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
        <h2 className="text-center mb-4">All Client Payments Overview</h2>
        {tasks.length === 0 ? (
          <p className="text-center">No payment records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Task ID</th>
                  <th>Client Name</th>
                  <th>Freelancer</th>
                  <th>Description</th>
                  <th>Budget</th>
                  <th>Payment Status</th>
                  <th>Half Paid At</th>
                  <th>Fully Paid At</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task._id}</td>
                    <td>{task.ClientId?.username || "N/A"}</td>
                    <td>{task.freelancerId?.username || "N/A"}</td>
                    <td>{task.description}</td>
                    <td>${task.budget}</td>
                    <td>{task.paymentStatus || "pending"}</td>
                    <td>{task.halfPaidAt ? new Date(task.halfPaidAt).toLocaleString() : "N/A"}</td>
                    <td>{task.fullyPaidAt ? new Date(task.fullyPaidAt).toLocaleString() : "N/A"}</td>
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

export default AdminAllPayments;