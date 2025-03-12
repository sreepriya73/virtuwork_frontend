import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const ClientTaskProgress = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stepsTemplate = [
    { id: "1", name: "Planning" },
    { id: "2", name: "Design" },
    { id: "3", name: "Development" },
    { id: "4", name: "Testing" },
    { id: "5", name: "Deployment" },
  ];

  useEffect(() => {
    const fetchTaskProgress = async () => {
      try {
        console.log("Task ID from useParams:", taskId);

        if (!taskId || !/^[0-9a-fA-F]{24}$/.test(taskId)) {
          throw new Error("Invalid task ID in URL.");
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view task progress.");
        }

        const progressResponse = await axios.get(`http://localhost:3030/tasks/${taskId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const taskResponse = await axios.get(`http://localhost:3030/tasks/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const selectedTask = taskResponse.data.find((t) => t._id.toString() === taskId);
        if (!selectedTask) {
          throw new Error("Task not found or you don’t have access to it.");
        }

        const progressData = progressResponse.data.progress || {};
        const steps = stepsTemplate.map((step) => ({
          ...step,
          completed: progressData[step.id] || false,
        }));

        setTask({
          title: selectedTask.description,
          steps,
        });
      } catch (error) {
        console.error("Error fetching task progress:", error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || error.message || "Failed to fetch task progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskProgress();
  }, [taskId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="client-task-progress">{error}</div>;
  }

  if (!task) {
    return <div className="client-task-progress">Task not found.</div>;
  }

  const totalSteps = task.steps.length;
  const completedSteps = task.steps.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="client-task-progress">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>Task Progress: {task.title}</h1>
          <p>View the progress of your project.</p>
        </header>

        <section className="progress-section">
          <div className="progress-card">
            <h2>Project Progress</h2>
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

        <section className="steps-section">
          <div className="steps-card">
            <h2>Project Steps</h2>
            <ul className="steps-list">
              {task.steps.map((step) => (
                <li key={step.id} className="step-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={step.completed}
                      disabled
                    />
                    <span>{step.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <style jsx>{`
        .client-task-progress {
          background: #f4f7fc;
          min-height: 100vh;
          font-family: "Arial", sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
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
          width: 40px;
          height: 40px;
          border: 4px solid #007bff;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
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
        }

        .checkbox-label input {
          margin-right: 15px;
          width: 20px;
          height: 20px;
          accent-color: #007bff;
          opacity: 0.6;
        }

        .checkbox-label span {
          flex: 1;
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
        }
      `}</style>
    </div>
  );
};

export default ClientTaskProgress;