import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentWork = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklySubmissions, setWeeklySubmissions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCurrentWork = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Please log in to view current work.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3030/tasks/current-work", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const taskData = response.data.task;
        if (!taskData || !taskData.deadline) {
          setError("Task data or deadline is missing from the response.");
          setLoading(false);
          return;
        }
        setTask(taskData);
        setLoading(false);

        // Dynamically calculate weekly submissions based on deadline
        calculateWeeklySubmissions(taskData.deadline);
      } catch (error) {
        console.error("Error fetching current work:", error);
        setError("Error fetching data: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    const calculateWeeklySubmissions = (deadline) => {
      const now = new Date();
      let endDate = new Date(deadline);
      console.log("Raw Deadline from API:", deadline); // Debug raw deadline
      console.log("Parsed Deadline:", endDate); // Debug parsed date

      // Handle invalid date parsing
      if (isNaN(endDate.getTime())) {
        console.log("Invalid deadline format, using fallback.");
        endDate = new Date(); // Fallback to current date if parsing fails
        endDate.setDate(endDate.getDate() + 30); // Default to 30 days from now
      }

      const totalDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      console.log("Total Days until Deadline:", totalDays); // Debug total days

      // Handle past or today’s deadline with a minimum of 4 weeks as fallback
      let weeks = Math.max(1, Math.floor(totalDays / 7));
      if (totalDays <= 0) {
        console.log("Deadline is in the past or today, using 4-week fallback.");
        weeks = 4; // Minimum 4 weeks as fallback
      }

      const submissions = [];
      for (let i = 1; i <= weeks; i++) {
        const weekDeadline = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        if (weekDeadline <= endDate || totalDays <= 0) {
          submissions.push({
            week: `Week ${i} Submission`,
            deadline: weekDeadline.toLocaleDateString(),
            submitted: false,
          });
        }
      }
      console.log("Generated Weekly Submissions:", submissions); // Debug generated submissions
      setWeeklySubmissions(submissions);
    };

    fetchCurrentWork();
  }, []);

  const handleSubmitWeek = async (weekIndex) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !file) {
        setError("Please log in and select a file to submit.");
        return;
      }

      const formData = new FormData();
      formData.append("submission", file);
      formData.append("week", weeklySubmissions[weekIndex].week);

      const response = await axios.put(
        `http://localhost:3030/tasks/submit/${task._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedSubmissions = [...weeklySubmissions];
      updatedSubmissions[weekIndex].submitted = true;
      updatedSubmissions[weekIndex].file = file.name; // Store file name for display
      setWeeklySubmissions(updatedSubmissions);
      setFile(null); // Clear file input
      setShowPopup(false); // Close popup, staying on the same page
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting work:", error);
      setError("Failed to submit work: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitTask = () => {
    if (weeklySubmissions.length > 0) {
      setShowPopup(true); // Open modal on the same page
    } else {
      setError("No weekly submissions available for this task.");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Current Work</h2>
      {task && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Field</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Task ID:</td>
                <td style={{ padding: "10px" }}>{task._id}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Client Name:</td>
                <td style={{ padding: "10px" }}>{task.ClientId?.username || "N/A"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Description:</td>
                <td style={{ padding: "10px" }}>{task.description}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Category:</td>
                <td style={{ padding: "10px" }}>{task.category}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Deadline:</td>
                <td style={{ padding: "10px" }}>{new Date(task.deadline).toLocaleDateString()}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Budget:</td>
                <td style={{ padding: "10px" }}>${task.budget}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Freelancer Confirmation:</td>
                <td style={{ padding: "10px" }}>{task.freelancerConfirmation}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Action:</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={handleSubmitTask}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Upload Task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {showPopup && (
            <div style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "500px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}>
                <h3 style={{ marginTop: "0", textAlign: "center" }}>Submit Work for Task {task._id}</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                      <th style={{ padding: "10px", textAlign: "left" }}>Week</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Deadline</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Task Submission Area</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySubmissions.map((week, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "10px" }}>{week.week}</td>
                        <td style={{ padding: "10px" }}>{week.deadline}</td>
                        <td style={{ padding: "10px" }}>
                          <input
                            type="file"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files.length > 0) setFile(files[0]);
                              setSelectedWeekIndex(index);
                            }}
                            style={{ padding: "5px" }}
                            placeholder="Upload your task file"
                          />
                        </td>
                        <td style={{ padding: "10px" }}>
                          <button
                            onClick={() => handleSubmitWeek(index)}
                            disabled={week.submitted || !file}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: (week.submitted || !file) ? "#ccc" : "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              cursor: (week.submitted || !file) ? "not-allowed" : "pointer",
                            }}
                          >
                            {week.submitted ? "Submitted" : "Submit"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setFile(null); // Clear file selection on close
                      setSelectedWeekIndex(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentWork; // Ensure no trailing text or comments