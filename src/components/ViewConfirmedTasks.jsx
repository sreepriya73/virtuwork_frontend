// ViewConfirmedTasks.jsx (partial update)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewConfirmedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/freelancer-confirmed");
        console.log("Response data:", response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching confirmed tasks:", error.response?.data || error.message);
        setError("Failed to load confirmed tasks: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    fetchConfirmedTasks();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "20px" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Confirmed Tasks</h2>
      {tasks.length === 0 ? (
        <p>No confirmed tasks available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}
            >
              <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
              <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
              
              <button
                onClick={() => navigate(`/submit-work/${task._id}`)}
                style={{ padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px" }}
              >
                Submit Work
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewConfirmedTasks;