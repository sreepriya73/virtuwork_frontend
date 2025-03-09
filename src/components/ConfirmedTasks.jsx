import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const ConfirmedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          window.location.href = "/SignIn";
          return;
        }

        const response = await axios.get("http://localhost:3030/tasks/client-confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch confirmed tasks");
        console.error("Error fetching confirmed tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedTasks();
  }, []);

  const handlePaymentNavigation = (taskId, isFinalPayment) => {
    if (isFinalPayment) {
      const rating = prompt("Please rate the freelancer (1-5 stars):");
      if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
        navigate(`/payment/${taskId}`, { state: { rating } });
      } else {
        alert("Please provide a valid rating between 1 and 5.");
      }
    } else {
      navigate(`/payment/${taskId}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Confirmed Tasks</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {tasks.length === 0 ? (
          <p className="text-center">No confirmed tasks found.</p>
        ) : (
          <ul className="list-group">
            {tasks.map((task) => (
              <li key={task._id} className="list-group-item mb-3">
                <p><strong>Task ID:</strong> {task._id}</p>
                <p><strong>Freelancer:</strong> {task.freelancerId?.username || "N/A"}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                <p><strong>Total Budget:</strong> ${task.budget}</p>
                <p><strong>Payment Status:</strong> {task.paymentStatus || "pending"}</p>
                {task.submission && (
                  <p><strong>Submission:</strong> <a href={task.submission} target="_blank" rel="noopener noreferrer">View Submission</a></p>
                )}
                {task.rating && (
                  <p><strong>Rating Given:</strong> {task.rating} / 5</p>
                )}
                <div className="mt-2">
                  {(task.paymentStatus === "pending" || (task.paymentStatus === "half paid" && task.submission)) && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePaymentNavigation(task._id, task.paymentStatus === "half paid" && task.submission)}
                    >
                      {task.paymentStatus === "pending" ? "Make Half Payment" : "Make Final Payment"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConfirmedTasks;