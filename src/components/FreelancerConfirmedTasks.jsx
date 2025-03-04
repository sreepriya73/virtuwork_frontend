import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerConfirmedTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch freelancer-confirmed tasks from the backend
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
    <div style={{ padding: "20px" }}>
      <h2>Freelancer Confirmed Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks confirmed by freelancers yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
              <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FreelancerConfirmedTasks;