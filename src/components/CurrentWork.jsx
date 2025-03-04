import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentWork = () => {
  const [task, setTask] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentWork = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/current-work");
        setTask(response.data.task);
        setProgress(response.data.progress);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching current work:", error);
        setError("No confirmed tasks available or error fetching data.");
        setLoading(false);
      }
    };
    fetchCurrentWork();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Current Work</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "5px",
          maxWidth: "600px",
        }}
      > <p><strong>Task ID:</strong> {task._id}</p> {/* Added Task ID */}
        <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
        <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
        <p><strong>Budget:</strong> ${task.budget}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>

        <h3>Progress: {Math.round(progress)}%</h3>
        <div style={{ width: "100%", backgroundColor: "#ddd", height: "20px", marginTop: "10px" }}>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "green",
              height: "100%",
              transition: "width 0.5s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWork;