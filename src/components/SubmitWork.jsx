// SubmitWork.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitWork = () => {
  const [submission, setSubmission] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch confirmed tasks on load
  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:3030/tasks/freelancer-confirmed", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log("Confirmed tasks:", response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching confirmed tasks:", error.response?.data || error.message);
        setError("Failed to load tasks: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    fetchConfirmedTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setError("Please select a task to submit work for.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3030/tasks/submit/${selectedTaskId}`,
        { submission }
      );

      alert(response.data.message);
      setSubmission("");
      setSelectedTaskId("");
      navigate("/ViewSubmittedWorks");
    } catch (error) {
      console.error("Error submitting work:", error.response?.data || error.message);
      setError("Failed to submit work: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "20px" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit Work</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="taskSelect">Select Task:</label>
          <select
            id="taskSelect"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
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
        <div>
          <label htmlFor="submission">Work Submission (e.g., Git link or file URL):</label>
          <input
            type="text"
            id="submission"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Enter your submission link"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Submitting..." : "Submit Work"}
        </button>
      </form>
    </div>
  );
};

export default SubmitWork;