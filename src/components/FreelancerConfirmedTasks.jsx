import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerConfirmedTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/freelancer-confirmed");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching freelancer-confirmed tasks:", error);
      }
    };
    fetchConfirmedTasks();
  }, []);

  return (
    <div>
      <NavBar/>
   
    <div className="freelancer-confirmed-tasks-page">
      <div className="container">
        <header className="header">
          <h2>Freelancer Confirmed Tasks</h2>
        </header>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks confirmed by freelancers yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-card">
                <div className="task-details">
                  <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
                  <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                  <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                  <p><strong>Budget:</strong> ${task.budget}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .freelancer-confirmed-tasks-page {
          background: #f8f9fa;
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
          color: #343a40; /* Dark gray for admin theme */
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
          color: #343a40;
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

export default FreelancerConfirmedTasks;