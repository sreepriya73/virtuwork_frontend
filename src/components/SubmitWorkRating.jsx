import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const SubmitWorkRating = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        if (!userId) {
          setError("No user ID found. Please sign in.");
          navigate("/SignIn");
          return;
        }

        console.log("Fetching tasks for userId:", userId);
        const response = await axios.get(`http://localhost:3030/tasks/client/${userId}/completed`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log("API Response:", response.data);

        const completedTasks = response.data.filter(task => !task.rating);
        setTasks(completedTasks);
        if (completedTasks.length === 0) {
          setError("No unrated completed tasks found.");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        const errorMessage = err.response?.data?.error || err.message || "Failed to load completed tasks.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleTaskSelect = (e) => {
    const taskId = e.target.value;
    const task = tasks.find(t => t._id === taskId);
    setSelectedTask(task || null);
    setRating(0);
  };

  const handleRate = async () => {
    if (!selectedTask || !rating) {
      setError("Please select a task and provide a rating.");
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(`http://localhost:3030/tasks/${selectedTask._id}/rate`, { rating }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSuccess("Rating submitted successfully!");
      setTasks(tasks.filter(t => t._id !== selectedTask._id));
      setSelectedTask(null);
      setRating(0);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(err.response?.data?.error || "Failed to submit rating.");
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="submit-work-rating">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>Rate Freelancer Work</h1>
          <p>Select a completed task to rate the freelancer.</p>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="task-dropdown">
          <select
            value={selectedTask ? selectedTask._id : ""}
            onChange={handleTaskSelect}
          >
            <option value="">Select a completed task</option>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <option key={task._id} value={task._id}>
                  {task.description} - Freelancer: {task.freelancerId?.username || "N/A"} (ID: {task.freelancerId?._id || task.freelancerId})
                </option>
              ))
            ) : (
              <option value="" disabled>No completed tasks available for rating</option>
            )}
          </select>
        </div>

        {selectedTask && (
          <div className="rating-section">
            <h2>Rate: {selectedTask.description}</h2>
            <p>Freelancer: {selectedTask.freelancerId?.username || "N/A"} (ID: {selectedTask.freelancerId?._id || selectedTask.freelancerId})</p>
            <p>Submission: <a href={selectedTask.submission} target="_blank" rel="noopener noreferrer">View Submission</a></p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="btn btn-submit" onClick={handleRate}>
              Submit Rating
            </button>
          </div>
        )}

        <button className="btn btn-back" onClick={() => navigate("/ClientDash")}>
          Back to Dashboard
        </button>
      </div>

      <style jsx>{`
        .submit-work-rating {
          background: linear-gradient(135deg, #f4f7fc 0%, #e9ecef 100%);
          min-height: 100vh;
          font-family: 'Roboto', 'Arial', sans-serif;
          padding-top: 20px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(90deg, #1a3c66 0%, #2e5b99 100%);
          border-radius: 15px 15px 0 0;
          color: #fff;
          animation: fadeIn 0.5s ease-in;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .header p {
          font-size: 1.2rem;
          margin: 10px 0 0;
          opacity: 0.9;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f4f7fc;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #1a3c66;
          border-top: 5px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .alert {
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-size: 1.1rem;
          font-weight: 500;
          text-align: center;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .alert-danger {
          background: linear-gradient(90deg, #f8d7da, #f1aeb5);
          color: #721c24;
          border: 1px solid #f1aeb5;
        }

        .alert-success {
          background: linear-gradient(90deg, #d4edda, #b7e1cd);
          color: #155724;
          border: 1px solid #b7e1cd;
        }

        .task-dropdown {
          margin-bottom: 40px;
          text-align: center;
        }

        .task-dropdown select {
          width: 100%;
          max-width: 700px;
          padding: 14px 20px;
          font-size: 1.1rem;
          border: none;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%231a3c66" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 15px center;
        }

        .task-dropdown select:hover,
        .task-dropdown select:focus {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          outline: none;
        }

        .rating-section {
          background: #ffffff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          margin-bottom: 40px;
          animation: fadeInUp 0.5s ease-out;
        }

        .rating-section h2 {
          font-size: 1.9rem;
          font-weight: 600;
          color: #1a3c66;
          margin-bottom: 15px;
          letter-spacing: 0.5px;
        }

        .rating-section p {
          font-size: 1.1rem;
          color: #444;
          margin-bottom: 15px;
          font-weight: 400;
        }

        .rating-section a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .rating-section a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .stars {
          margin-bottom: 25px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .star {
          font-size: 2.8rem;
          color: #e4e5e9;
          cursor: pointer;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .star:hover,
        .star.filled {
          color: #ffc107;
          transform: scale(1.1);
        }

        .btn {
          padding: 12px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-submit {
          background: linear-gradient(90deg, #28a745, #34c759);
          color: #fff;
        }

        .btn-submit:hover {
          background: linear-gradient(90deg, #218838, #2db44f);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
        }

        .btn-back {
          background: linear-gradient(90deg, #007bff, #00aaff);
          color: #fff;
          display: block;
          margin: 0 auto;
          padding: 12px 40px;
        }

        .btn-back:hover {
          background: linear-gradient(90deg, #0056b3, #0088cc);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
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
          .header h1 {
            font-size: 2rem;
          }
          .header p {
            font-size: 1rem;
          }
          .task-dropdown select {
            padding: 12px 15px;
            font-size: 1rem;
          }
          .rating-section {
            padding: 20px;
          }
          .rating-section h2 {
            font-size: 1.6rem;
          }
          .star {
            font-size: 2.2rem;
          }
          .btn {
            padding: 10px 20px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitWorkRating;