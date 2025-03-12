import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const ClientTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view your tasks.");
        }

        const response = await axios.get("http://localhost:3030/tasks/client-confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error.response?.data?.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleViewProgress = (taskId) => {
    navigate(`/client-task-progress/${taskId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="client-task-list">{error}</div>;
  }

  return (
    <div className="client-task-list">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>Your Active Tasks</h1>
          <p>Tasks being worked on by freelancers</p>
        </header>

        {tasks.length === 0 ? (
          <p>No active tasks found.</p>
        ) : (
          <section className="task-list-section">
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <div className="task-details">
                    <h3>{task.description}</h3>
                    <p>Freelancer: {task.freelancerId?.username || "Assigned"}</p>
                    <p>Budget: ${task.budget}</p>
                    <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="view-progress-btn"
                    onClick={() => handleViewProgress(task._id)}
                  >
                    View Progress
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .client-task-list {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: "Arial", sans-serif;
        }

        .container {
          max-width: 800px;
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

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a3c66;
        }

        .header p {
          font-size: 1.1rem;
          color: #666;
        }

        .task-list-section {
          background: #fff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .task-list {
          list-style: none;
          padding: 0;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #e6e6e6;
        }

        .task-item:last-child {
          border-bottom: none;
        }

        .task-details h3 {
          font-size: 1.2rem;
          color: #1a3c66;
          margin: 0 0 5px;
        }

        .task-details p {
          font-size: 0.95rem;
          color: #666;
          margin: 2px 0;
        }

        .view-progress-btn {
          padding: 8px 16px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .view-progress-btn:hover {
          background: #0056b3;
        }

        @media (max-width: 768px) {
          .task-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .view-progress-btn {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientTaskList;