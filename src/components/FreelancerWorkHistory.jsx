import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const FreelancerWorkHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkHistory = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (!userId || !token) {
          navigate("/SignIn");
          return;
        }

        const response = await axios.get(
          `http://localhost:3030/tasks/freelancer/${userId}/completed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch work history");
        console.error("Error fetching work history:", err);
        setLoading(false);
      }
    };

    fetchWorkHistory();
  }, [navigate]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
  if (error) return (
    <div className="error-container">
      <h2>Error</h2>
      <p className="error-message">{error}</p>
    </div>
  );

  return (
    <div className="work-history-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>Your Completed Work History</h2>
        </header>

        {tasks.length === 0 ? (
          <p className="no-tasks">No completed tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-card">
                <div className="task-details">
                  <p><strong>Task ID:</strong> {task._id}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                  <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                  <p><strong>Total Budget:</strong> ${task.budget}</p>
                  <p><strong>Half Payment:</strong> 
                    {task.halfPaidAt
                      ? `$${task.budget / 2} (${new Date(task.halfPaidAt).toLocaleDateString()})`
                      : "Pending"}
                  </p>
                  <p><strong>Full Payment:</strong> 
                    {task.fullyPaidAt
                      ? `$${task.budget / 2} (${new Date(task.fullyPaidAt).toLocaleDateString()})`
                      : "Pending"}
                  </p>
                  <p><strong>Platform Charges:</strong> 
                    ${(task.halfPaymentPlatformCharge + task.fullPaymentPlatformCharge).toFixed(2)}
                  </p>
                  <p><strong>Payment Status:</strong> {task.paymentStatus}</p>
                  <p><strong>Submission Date:</strong> 
                    {task.submission ? new Date(task.submissionDate).toLocaleDateString() : "N/A"}
                  </p>
                  <p><strong>Rating:</strong> {task.rating ? `${task.rating}/5` : "Not Rated"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .work-history-page {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .container {
          max-width: 1100px;
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
          color: #2e7d32; /* Green theme for freelancers */
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
          border: 4px solid #2e7d32;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-container h2 {
          font-size: 1.8rem;
          color: #dc3545;
          margin-bottom: 10px;
        }

        .error-message {
          font-size: 1.1rem;
          color: #dc3545;
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
          display: grid;
          grid-template-columns: 1fr 1fr; /* Two-column layout */
          gap: 10px 20px;
        }

        .task-details p {
          margin: 8px 0;
          font-size: 1rem;
          color: #333;
        }

        .task-details strong {
          color: #2e7d32;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .header h2 {
            font-size: 1.8rem;
          }

          .task-card {
            padding: 15px;
          }

          .task-details {
            grid-template-columns: 1fr; /* Single column on mobile */
          }

          .task-details p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FreelancerWorkHistory;