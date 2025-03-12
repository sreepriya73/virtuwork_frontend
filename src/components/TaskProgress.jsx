import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const TaskProgress = () => {
  // Define project steps (you can customize these)
  const steps = [
    { id: 1, name: "Planning" },
    { id: 2, name: "Design" },
    { id: 3, name: "Development" },
    { id: 4, name: "Testing" },
    { id: 5, name: "Deployment" },
  ];

  // State to track which steps are checked
  const [checkedSteps, setCheckedSteps] = useState(
    steps.reduce((acc, step) => ({ ...acc, [step.id]: false }), {})
  );
  const [tasks, setTasks] = useState([]); // List of confirmed/half-paid tasks
  const [selectedTask, setSelectedTask] = useState(null); // Selected task
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success message for saving progress
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if task is submitted
  const [isFinalSaved, setIsFinalSaved] = useState(false); // Tracks if progress is final saved

  const navigate = useNavigate();

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Please log in to view tasks.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3030/tasks/freelancer-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter for confirmed or half-paid tasks
        const filteredTasks = response.data.filter(
          (task) => task.status === "confirmed" || task.paymentStatus === "half paid"
        );
        setTasks(filteredTasks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task selection from dropdown and fetch existing progress
  const handleTaskSelect = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setSelectedTask(task);
    setSuccess(null); // Clear previous success message
    setError(null);   // Clear previous error message
    setIsSubmitted(task?.submission ? true : false); // Check if task is submitted
    setIsFinalSaved(false); // Reset final save status

    // Fetch existing progress for the selected task
    if (task) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3030/tasks/${task._id}/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = response.data.progress || {};
        const finalSaved = response.data.isFinalSaved || false; // Assuming backend returns this
        setCheckedSteps(
          steps.reduce(
            (acc, step) => ({
              ...acc,
              [step.id]: progressData[step.id] || false,
            }),
            {}
          )
        );
        setIsFinalSaved(finalSaved);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load task progress: " + (err.response?.data?.message || err.message));
        setCheckedSteps(steps.reduce((acc, step) => ({ ...acc, [step.id]: false }), {}));
      }
    } else {
      setCheckedSteps(steps.reduce((acc, step) => ({ ...acc, [step.id]: false }), {}));
    }
  };

  // Save progress to backend (temporary save)
  const saveProgress = async (updatedSteps) => {
    if (!selectedTask || isSubmitted || isFinalSaved) return; // Prevent saving if submitted or final saved

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3030/tasks/${selectedTask._id}/progress`,
        { progress: updatedSteps, isFinalSaved: false }, // Explicitly mark as not final
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Progress saved successfully!");
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3s
    } catch (err) {
      console.error("Error saving progress:", err);
      setError("Failed to save progress: " + (err.response?.data?.message || err.message));
      setTimeout(() => setError(null), 3000); // Clear error message after 3s
    }
  };

  // Handle final save
  const handleFinalSave = async () => {
    if (!selectedTask || isSubmitted || isFinalSaved) return;

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3030/tasks/${selectedTask._id}/progress`,
        { progress: checkedSteps, isFinalSaved: true }, // Mark as final save
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Progress has been permanently saved!");
      setIsFinalSaved(true); // Lock further changes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error final saving progress:", err);
      setError("Failed to save progress permanently: " + (err.response?.data?.message || err.message));
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle checkbox change and save progress
  const handleCheckboxChange = (stepId) => {
    if (isSubmitted || isFinalSaved) return; // Prevent changes if submitted or final saved

    setCheckedSteps((prev) => {
      const updatedSteps = {
        ...prev,
        [stepId]: !prev[stepId],
      };
      // Save progress after updating state
      saveProgress(updatedSteps);
      return updatedSteps;
    });
  };

  // Navigation handlers
  const handleSubmitWorkNavigation = () => {
    navigate("/SubmitWork");
  };

  const handleFreelancerDashNavigation = () => {
    navigate("/FreelancerDash");
  };

  // Calculate progress percentage
  const totalSteps = steps.length;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  if (loading) return <div className="task-progress">Loading...</div>;
  if (error && !selectedTask) return <div className="task-progress">{error}</div>;

  return (
    <div className="task-progress">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>Task Progress</h1>
          <p>Track your project steps and see your progress!</p>
        </header>

        {/* Search Bar with Dropdown */}
        <section className="search-section">
          <div className="search-bar">
            <label htmlFor="task-select" className="search-label">
              Select a Task:
            </label>
            <select
              id="task-select"
              value={selectedTask?._id || ""}
              onChange={(e) => handleTaskSelect(e.target.value)}
              className="task-dropdown"
            >
              <option value="">-- Select a Task --</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task._id} - {task.title}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Show progress only if a task is selected */}
        {selectedTask && (
          <>
            {/* Success/Error Messages */}
            {success && (
              <div className="success-message">{success}</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
            {isSubmitted && (
              <div className="info-message">
                This task has been submitted and progress tracking is disabled.
              </div>
            )}
            {isFinalSaved && !isSubmitted && (
              <div className="info-message">
                Progress has been permanently saved and cannot be changed.
              </div>
            )}

            {/* Progress Bar */}
            <section className="progress-section">
              <div className="progress-card">
                <h2>Project Progress: {selectedTask.title}</h2>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {completedSteps} of {totalSteps} steps completed ({progressPercentage.toFixed(0)}%)
                </p>
              </div>
            </section>

            {/* Steps Checkboxes */}
            <section className="steps-section">
              <div className="steps-card">
                <h2>Project Steps</h2>
                <ul className="steps-list">
                  {steps.map((step) => (
                    <li key={step.id} className="step-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={checkedSteps[step.id]}
                          onChange={() => handleCheckboxChange(step.id)}
                          disabled={isSubmitted || isFinalSaved} // Disable if submitted or final saved
                        />
                        <span>{step.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {/* Final Save Button */}
                <button
                  className="final-save-btn"
                  onClick={handleFinalSave}
                  disabled={isSubmitted || isFinalSaved}
                >
                  Final Save Progress
                </button>
              </div>
            </section>
          </>
        )}

        {/* Navigation Buttons */}
        <section className="navigation-section">
          <button
            className="nav-button submit-work-btn"
            onClick={handleSubmitWorkNavigation}
            disabled={!isFinalSaved || isSubmitted} // Enable only if final saved and not submitted
          >
            Go to Submit Work
          </button>
          <button className="nav-button freelancer-dash-btn" onClick={handleFreelancerDashNavigation}>
            Go to Freelancer Dashboard
          </button>
        </section>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .task-progress {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: "Arial", sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a3c66;
          margin-bottom: 10px;
        }

        .header p {
          font-size: 1.1rem;
          color: #666;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 40px;
          text-align: center;
        }

        .search-bar {
          display: inline-flex;
          align-items: center;
          gap: 15px;
        }

        .search-label {
          font-size: 1.2rem;
          color: #4a6f99;
          font-weight: 600;
        }

        .task-dropdown {
          padding: 10px;
          font-size: 1.1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 100%;
          max-width: 400px;
          background: #fff;
          color: #333;
          cursor: pointer;
        }

        .task-dropdown:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        /* Progress Section */
        .progress-section {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }

        .progress-card {
          background: linear-gradient(135deg, #ffffff, #e6f0fa);
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .progress-card:hover {
          transform: translateY(-5px);
        }

        .progress-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          margin-bottom: 20px;
        }

        .progress-bar-container {
          width: 100%;
          height: 20px;
          background: #ddd;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #00c4cc);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 1.1rem;
          color: #4a6f99;
        }

        /* Steps Section */
        .steps-section {
          display: flex;
          justify-content: center;
        }

        .steps-card {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .steps-card:hover {
          transform: translateY(-5px);
        }

        .steps-card h2 {
          font-size: 1.8rem;
          color: #1a3c66;
          text-align: center;
          margin-bottom: 20px;
        }

        .steps-list {
          list-style: none;
          padding: 0;
        }

        .step-item {
          padding: 15px 0;
          border-bottom: 1px solid #e6e6e6;
        }

        .step-item:last-child {
          border-bottom: none;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          font-size: 1.1rem;
          color: #666;
          cursor: pointer;
        }

        .checkbox-label input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .checkbox-label input {
          margin-right: 15px;
          width: 20px;
          height: 20px;
          accent-color: #007bff;
          cursor: pointer;
        }

        .checkbox-label span {
          flex: 1;
        }

        /* Success/Error/Info Messages */
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }

        .info-message {
          background: #cce5ff;
          color: #004085;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }

        /* Navigation Section */
        .navigation-section {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }

        .nav-button {
          padding: 10px 20px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-work-btn {
          background: linear-gradient(90deg, #007bff, #00c4cc);
        }

        .submit-work-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .submit-work-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #0056b3, #009b9f);
        }

        .freelancer-dash-btn {
          background: linear-gradient(90deg, #28a745, #20c997);
        }

        .freelancer-dash-btn:hover {
          background: linear-gradient(90deg, #1e7e34, #17a078);
        }

        /* Final Save Button */
        .final-save-btn {
          display: block;
          margin: 20px auto 0;
          padding: 10px 20px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(90deg, #ff5722, #f06292);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .final-save-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .final-save-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #e64a19, #d81b60);
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }

          .progress-card,
          .steps-card {
            padding: 20px;
          }

          .progress-card h2,
          .steps-card h2 {
            font-size: 1.5rem;
          }

          .checkbox-label {
            font-size: 1rem;
          }

          .search-bar {
            flex-direction: column;
            gap: 10px;
          }

          .task-dropdown {
            width: 100%;
          }

          .navigation-section {
            flex-direction: column;
            gap: 10px;
          }

          .nav-button,
          .final-save-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskProgress;