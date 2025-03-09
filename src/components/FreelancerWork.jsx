import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const FreelancerWork = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          window.location.href = "/SignIn";
          return;
        }

        const response = await axios.get("http://localhost:3030/tasks/freelancer-confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData = response.data.find((t) => t._id === taskId);
        if (!taskData) throw new Error("Task not found or not confirmed by you");
        setTask(taskData);
      } catch (err) {
        setError(err.message || "Failed to fetch task details");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitWork = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("submission", file);

      const response = await axios.put(
        `http://localhost:3030/tasks/submit/${taskId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } } // Let axios set Content-Type automatically
      );

      setTask({ ...task, submission: response.data.task.submission });
      alert(response.data.message);
      navigate("/confirm-task");
    } catch (error) {
      console.error("Error submitting work:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error || !task) return (
    <div className="container mt-5">
      <h2 className="text-center">Error</h2>
      <p className="text-center text-danger">{error || "Task not found"}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Continue Work on Confirmed Task</h2>
        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <h4>Task Details</h4>
          <p><strong>Task ID:</strong> {task._id}</p>
          <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Category:</strong> {task.category}</p>
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Total Budget:</strong> ${task.budget}</p>
          <p>
            <strong>Payment Status:</strong> {task.paymentStatus || "pending"}
            {task.paymentStatus === "half paid" && (
              <span style={{ color: "green", marginLeft: "10px" }}>● Half Paid</span>
            )}
            {task.paymentStatus === "fully paid" && (
              <span style={{ color: "blue", marginLeft: "10px" }}>● Fully Paid</span>
            )}
          </p>
          <p><strong>Current Submission:</strong> {task.submission ? <a href={`http://localhost:3030/${task.submission}`} target="_blank">View PDF</a> : "Not submitted yet"}</p>

          {!task.submission && (
            <>
              <div className="mb-3">
                <label htmlFor="submission" className="form-label">Upload Final PDF</label>
                <input
                  type="file"
                  className="form-control"
                  id="submission"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={handleSubmitWork}
                disabled={!file || task.paymentStatus !== "half paid"}
              >
                Submit Work
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerWork;