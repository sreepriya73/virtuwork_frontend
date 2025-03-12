import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/all");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/tasks/delete/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  const acceptTask = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3030/tasks/accept/${id}`);
      setTasks(tasks.map((task) =>
        task._id === id ? { ...task, status: "accepted" } : task
      ));
      alert("Task accepted successfully");
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Error accepting task");
    }
  };

  return (
    <div className="view-tasks-page">
      <div className="container">
        <header className="header">
          <h2>All Tasks</h2>
        </header>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-card">
              <div className="task-details">
                <p><strong>Task ID:</strong> {task._id}</p>
                <p><strong>Description:</strong> {task.description}</p>
 tense               <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ${task.budget}</p>
                <p><strong>Status:</strong> {task.status || "pending"}</p>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => deleteTask(task._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
                {task.status !== "accepted" && (
                  <button
                    onClick={() => acceptTask(task._id)}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .view-tasks-page {
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

        .task-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .delete-btn,
        .accept-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .delete-btn {
          background: #dc3545;
          color: #fff;
        }

        .delete-btn:hover {
          background: #b02a37;
          transform: scale(1.05);
        }

        .accept-btn {
          background: #28a745;
          color: #fff;
        }

        .accept-btn:hover {
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

          .delete-btn,
          .accept-btn {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewTasks;