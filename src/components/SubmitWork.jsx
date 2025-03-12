import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const SubmitWork = () => {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
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
    setSubmissionLink("");
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
        { submission: submissionLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setSubmissionLink("");
      setSelectedTaskId("");
      navigate("/ViewSubmittedWorks");
    } catch (error) {
      console.error("Error submitting work:", error.response?.data || error.message);
      setError("Failed to submit work: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="submit-work-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>Submit Work</h2>
        </header>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label htmlFor="taskSelect">Select Task:</label>
            <select
              id="taskSelect"
              value={selectedTaskId}
              onChange={handleTaskChange}
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
            <div className="task-details">
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

          <div className="form-group">
            <label htmlFor="submissionLink">Submission Link (e.g., GitHub URL):</label>
            <input
              type="text"
              id="submissionLink"
              value={submissionLink}
              onChange={handleLinkChange}
              placeholder="Enter your submission link (e.g., GitHub, Drive)"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !submissionLink || !selectedTaskId}
          >
            {loading ? "Submitting..." : "Submit Work"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .submit-work-page {
          background: linear-gradient(135deg, #f0f4f8 0%, #dfe6ee 100%);
          min-height: 100vh;
          font-family: 'Roboto', 'Arial', sans-serif;
          padding-top: 20px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 25px;
          background: rgba(255, 255, 255, 0.97);
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(6px);
          animation: fadeIn 0.5s ease-in;
        }

        .header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(90deg, #2e5b99 0%, #4a90e2 100%);
          border-radius: 15px 15px 0 0;
          color: #fff;
          margin-bottom: 30px;
        }

        .header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f0f4f8;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #2e5b99;
          border-top: 5px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          padding: 30px;
          text-align: center;
          font-size: 1.2rem;
          color: #721c24;
          background: linear-gradient(90deg, #f8d7da, #f1aeb5);
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          margin: 40px auto;
          max-width: 600px;
        }

        .error-message {
          color: #721c24;
          background: linear-gradient(90deg, #f8d7da, #f1aeb5);
          padding: 15px 20px;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        .submit-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2e5b99;
          margin-bottom: 8px;
        }

        .form-group select,
        .form-group input {
          width: 100%;
          padding: 12px 15px;
          font-size: 1rem;
          border: none;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .form-group select {
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%232e5b99" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 15px center;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .task-details {
          background: #f9fafc;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          animation: fadeInUp 0.5s ease-out;
        }

        .task-details h4 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #2e5b99;
          margin: 0 0 15px 0;
          border-bottom: 2px solid #e6ecf2;
          padding-bottom: 5px;
        }

        .task-details p {
          font-size: 1rem;
          color: #444;
          margin: 8px 0;
          line-height: 1.5;
        }

        .task-details strong {
          color: #2e5b99;
          font-weight: 500;
        }

        button {
          padding: 12px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(90deg, #28a745, #34c759);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          align-self: center;
        }

        button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        button:hover:not(:disabled) {
          background: linear-gradient(90deg, #218838, #2db44f);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px 15px;
          }

          .header h2 {
            font-size: 1.8rem;
          }

          .form-group label {
            font-size: 1rem;
          }

          .form-group select,
          .form-group input {
            padding: 10px 12px;
            font-size: 0.95rem;
          }

          .task-details h4 {
            font-size: 1.2rem;
          }

          .task-details p {
            font-size: 0.95rem;
          }

          button {
            padding: 10px 25px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitWork;