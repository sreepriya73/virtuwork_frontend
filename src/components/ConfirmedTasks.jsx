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

  // Navigation handler for Back to Client Dashboard
  const handleBackToDash = () => {
    navigate("/ClientDash"); // Adjust route if your client dashboard is different
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="confirmed-tasks-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>Confirmed Tasks</h2>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="no-tasks">No confirmed tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-card">
                <div className="task-details">
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
                </div>
                <div className="task-actions">
                  {(task.paymentStatus === "pending" || (task.paymentStatus === "half paid" && task.submission)) && (
                    <button
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

        {/* Back to Client Dashboard Button */}
        <section className="navigation-section">
          <button className="back-to-dash-btn" onClick={handleBackToDash}>
            Back to Client Dashboard
          </button>
        </section>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .confirmed-tasks-page {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a3c66; /* Blue theme for clients */
          margin: 0;
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
          border: 4px solid #1a3c66;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          max-width: 600px;
          margin: 0 auto 20px;
          padding: 15px;
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          text-align: center;
          font-size: 1.1rem;
        }

        .no-tasks {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .task-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 20px;
        }

        .task-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .task-details {
          margin-bottom: 15px;
        }

        .task-details p {
          margin: 8px 0;
          font-size: 1rem;
          color: #333;
        }

        .task-details strong {
          color: #1a3c66;
          font-weight: 600;
        }

        .task-details a {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .task-details a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .task-actions {
          display: flex;
          justify-content: flex-end;
        }

        .task-actions button {
          background: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .task-actions button:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        /* Navigation Section */
        .navigation-section {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .back-to-dash-btn {
          background: #28a745; /* Green to distinguish from payment buttons */
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .back-to-dash-btn:hover {
          background: #218838;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .header h2 {
            font-size: 1.8rem;
          }

          .task-card {
            padding: 15px;
          }

          .task-details p {
            font-size: 0.95rem;
          }

          .task-actions {
            justify-content: center;
          }

          .task-actions button {
            width: 100%;
            padding: 12px;
          }

          .back-to-dash-btn {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmedTasks;