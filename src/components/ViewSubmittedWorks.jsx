// ViewSubmittedWorks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewSubmittedWorks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmittedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/submitted");
        console.log("Response data:", response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching submitted tasks:", error.response?.data || error.message);
        setError("Failed to load submitted tasks: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchSubmittedTasks();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submitted Works</h2>
      {tasks.length === 0 ? (
        <p>No submitted works available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px", borderRadius: "5px" }}
            ><p><strong>Task ID:</strong> {task._id}</p> {/* Added Task ID */}
              <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
              <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
              {task.freelancerId ? (
                <>
                  <p><strong>Confirmed By (Freelancer Name):</strong> {task.freelancerId?.username || "N/A"}</p>
                  <p><strong>Freelancer ID:</strong> {task.freelancerId?._id || "N/A"}</p>
                </>
              ) : (
                <p><strong>Confirmed By:</strong> Not assigned</p>
              )}
              <p><strong>Submitted Work:</strong> {task.submission || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewSubmittedWorks;