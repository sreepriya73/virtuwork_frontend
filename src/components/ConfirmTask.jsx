import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmTask = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch accepted tasks from the backend
  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/accepted");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching accepted tasks:", error);
      }
    };
    fetchAcceptedTasks();
  }, []);

  // Confirm a task (update freelancerConfirmation and set freelancerId)
  const confirmTask = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please log in to confirm a task.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3030/tasks/confirm/${id}`,
        {}, // No body needed since freelancerId comes from token
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(tasks.map((task) =>
        task._id === id
          ? { ...task, freelancerConfirmation: "confirmed", freelancerId: { _id: sessionStorage.getItem("userId"), username: sessionStorage.getItem("userName") } }
          : task
      ));
      alert(response.data.message);
    } catch (error) {
      console.error("Error confirming task:", error);
      alert("Error confirming task");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Accepted Tasks for Confirmation</h2>
      {tasks.length === 0 ? (
        <p>No accepted tasks available for confirmation.</p>
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
            ><p><strong>Task ID:</strong> {task._id}</p> {/* Added Task ID */}
              <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
              <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
             
              <div style={{ marginTop: "10px" }}>
                {task.freelancerConfirmation === "pending" && (
                  <button
                    onClick={() => confirmTask(task._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConfirmTask;