import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const ConfirmTask = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

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
      alert(response.data.message);
    } catch (error) {
      console.error("Error confirming task:", error.response?.data || error.message);
      alert("Error confirming task: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <NavBar />
      <h2>Accepted Tasks for Confirmation</h2>
      {tasks.length === 0 ? (
        <p>No accepted tasks available for confirmation.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li key={task._id} style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}>
              <p><strong>Task ID:</strong> {task._id}</p>
              <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Freelancer Confirmation:</strong> {task.freelancerConfirmation}</p>
              <p>
                <strong>Payment Status:</strong> {task.paymentStatus || "pending"}
                {task.paymentStatus === "half paid" && (
                  <span style={{ color: "green", marginLeft: "10px" }}>● Half Paid</span>
                )}
                {task.paymentStatus === "fully paid" && (
                  <span style={{ color: "blue", marginLeft: "10px" }}>● Fully Paid</span>
                )}
              </p>
              <div style={{ marginTop: "10px" }}>
                {task.freelancerConfirmation === "pending" && (
                  <button
                    onClick={() => confirmTask(task._id)}
                    style={{ padding: "5px 10px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", marginRight: "10px" }}
                  >
                    Confirm
                  </button>
                )}
                {task.freelancerConfirmation === "confirmed" && task.paymentStatus === "half paid" && (
                  <button
                    onClick={() => navigate("/SubmitWork")}
                    style={{ padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px" }}
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
  );
};

export default ConfirmTask;