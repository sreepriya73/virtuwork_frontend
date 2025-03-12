import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewAcceptedTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3030/tasks/accepted');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching accepted tasks:', error);
      }
    };

    fetchAcceptedTasks();
  }, []);

  return (
    <div className="view-accepted-tasks-page">
      <div className="container">
        <header className="header">
          <h2>Accepted Tasks By Admin</h2>
        </header>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-card">
              <div className="task-details">
                <p><strong>Task ID:</strong> {task._id}</p>
                <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
                <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ${task.budget}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .view-accepted-tasks-page {
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

          .task-details p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewAcceptedTasks;