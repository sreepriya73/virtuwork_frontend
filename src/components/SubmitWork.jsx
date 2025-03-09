import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const SubmitWork = () => {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionLink, setSubmissionLink] = useState(""); // New state for link
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/SignIn");
          return;
        }
        const response = await axios.get("http://localhost:3030/tasks/freelancer-confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Confirmed tasks:", response.data);
        setTasks(response.data.filter(task => task.paymentStatus === "half paid" && !task.submission));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching confirmed tasks:", error.response?.data || error.message);
        setError("Failed to load tasks: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    fetchConfirmedTasks();
  }, [navigate]);

  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t._id === taskId);
    setSelectedTask(task || null);
    setSubmissionLink(""); // Reset link on task change
  };

  const handleLinkChange = (e) => {
    setSubmissionLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setError("Please select a task to submit work for.");
      return;
    }
    if (!submissionLink) {
      setError("Please provide a submission link.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3030/tasks/submit/${selectedTaskId}`,
        { submission: submissionLink }, // Send link as JSON
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setSubmissionLink("");
      setSelectedTaskId("");
      navigate("/confirm-task");
    } catch (error) {
      console.error("Error submitting work:", error.response?.data || error.message);
      setError("Failed to submit work: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <NavBar />
      <h2>Submit Work</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="taskSelect">Select Task:</label>
          <select
            id="taskSelect"
            value={selectedTaskId}
            onChange={handleTaskChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          >
            <option value="">-- Select a Task --</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.description} (ID: {task._id})
              </option>
            ))}
          </select>
        </div>

        {selectedTask && (
          <div style={{ marginBottom: "20px" }}>
            <h4>Task Details</h4>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Category:</strong> {selectedTask.category}</p>
            <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
            <p><strong>Total Budget:</strong> ${selectedTask.budget}</p>
            
            <h4>Client Details</h4>
            <p><strong>Client Name:</strong> {selectedTask.ClientId?.username || "N/A"}</p>
            
            <h4>Payment Details</h4>
            <p><strong>Payment Status:</strong> {selectedTask.paymentStatus || "pending"}</p>
            <p><strong>Half Paid Amount:</strong> ${selectedTask.budget / 2}</p>
            <p><strong>Half Paid At:</strong> {selectedTask.halfPaidAt ? new Date(selectedTask.halfPaidAt).toLocaleString() : "N/A"}</p>
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="submissionLink">Submission Link (e.g., GitHub URL):</label>
          <input
            type="text"
            id="submissionLink"
            value={submissionLink}
            onChange={handleLinkChange}
            placeholder="Enter your submission link (e.g., GitHub, Drive)"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !submissionLink || !selectedTaskId}
          style={{
            padding: "10px 20px",
            backgroundColor: (loading || !submissionLink || !selectedTaskId) ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: (loading || !submissionLink || !selectedTaskId) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Work"}
        </button>
      </form>
    </div>
  );
};

export default SubmitWork;