import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const ConfirmTask = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/accepted");
        const allTasks = response.data;
        setTasks(allTasks);

        const searchQuery = location.state?.searchQuery?.toLowerCase() || '';
        if (searchQuery) {
          const filtered = allTasks.filter(task =>
            task.description.toLowerCase().includes(searchQuery)
          );
          setFilteredTasks(filtered);
        } else {
          setFilteredTasks(allTasks);
        }
      } catch (error) {
        console.error("Error fetching accepted tasks:", error);
      }
    };
    fetchAcceptedTasks();
  }, [location.state]);

  const confirmTask = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please log in to confirm a task.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3030/tasks/confirm/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.map((task) =>
        task._id === id ? { ...task, ...response.data.task, freelancerConfirmation: "confirmed" } : task
      ));
      setFilteredTasks(filteredTasks.map((task) =>
        task._id === id ? { ...task, ...response.data.task, freelancerConfirmation: "confirmed" } : task
      ));
      alert(response.data.message);
    } catch (error) {
      console.error("Error confirming task:", error.response?.data || error.message);
      alert("Error confirming task: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="confirm-task-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>Accepted Tasks for Confirmation</h2>
        </header>

        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No accepted tasks match your search.</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task._id} className="task-card">
                <div className="task-details">
                  <p><strong>Task ID:</strong> {task._id}</p>
                  <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                  <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                  <p><strong>Budget:</strong> ${task.budget}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
                  <p className="payment-status">
                    <strong>Payment Status:</strong> {task.paymentStatus || "pending"}
                    {task.paymentStatus === "half paid" && (
                      <span className="status-indicator half-paid">● Half Paid</span>
                    )}
                    {task.paymentStatus === "fully paid" && (
                      <span className="status-indicator fully-paid">● Fully Paid</span>
                    )}
                  </p>
                </div>
                <div className="task-actions">
                  {task.freelancerConfirmation === "pending" && (
                    <button
                      onClick={() => confirmTask(task._id)}
                      className="confirm-btn"
                    >
                      Confirm
                    </button>
                  )}
                  {task.freelancerConfirmation === "confirmed" && task.paymentStatus === "half paid" && (
                    <button
                      onClick={() => navigate("/TaskProgress")}
                      className="continue-btn"
                    >
                      Continue to Work
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .confirm-task-page {
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
          color: #1a3c66;
          margin: 0;
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

        .payment-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-indicator {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-indicator.half-paid {
          color: #28a745;
        }

        .status-indicator.fully-paid {
          color: #007bff;
        }

        .task-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .confirm-btn, .continue-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .confirm-btn {
          background: #007bff;
          color: #fff;
        }

        .confirm-btn:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        .continue-btn {
          background: #28a745;
          color: #fff;
        }

        .continue-btn:hover {
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
            flex-direction: column;
            align-items: stretch;
          }

          .confirm-btn, .continue-btn {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmTask;