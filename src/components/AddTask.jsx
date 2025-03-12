import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const AddTask = () => {
  const [task, setTask] = useState({
    description: "",
    category: "",
    deadline: "",
    budget: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // New task descriptions from your provided list
  const taskDescriptions = [
    "Build a generative adversarial network (GAN)",
    "Build a microservice",
    "Build a microservice architecture",
    "Build a time series forecasting model",
    "Build AI-powered resume screening tool",
    "Build an emotion-based music recommendation system",
    "Build attention-based sequence model",
    "Build automated customer service with NLP",
    "Build facial recognition model",
    "Build human pose estimation model",
    "Build image classifier for animal species detection",
    "Build language model for poetry generation",
    "Build model for detecting diabetic retinopathy in images",
    "Build neural network for image classification",
    "Build object tracking model for video analysis",
    "Build personalized ad recommendation based on browsing data",
    "Build personalized learning recommendation model",
    "Build predictive maintenance model for machinery",
    "Build predictive model for user behavior",
    "Build real-time face authentication model",
    "Build recommendation model with deep learning",
    "Build scalable microservices",
    "Build speech-to-text model for voice commands",
    "Build text summarization model",
    "Conduct automated product tagging for e-commerce",
    "Conduct behavior analysis in retail environments",
    "Conduct clustering analysis for market segmentation",
    "Conduct disease prediction model for healthcare",
    "Conduct exploratory data analysis for ML project",
    "Conduct feature engineering for predictive model",
    "Conduct feature selection for a large dataset",
    "Conduct hyperparameter tuning",
    "Conduct model drift analysis",
    "Conduct multilingual sentiment analysis",
    "Conduct Named Entity Recognition (NER)",
    "Conduct OCR for scanned document processing",
    "Conduct performance testing",
    "Conduct personality prediction from social media",
    "Conduct predictive analytics for insurance claims",
    "Conduct real-time anomaly detection on IoT data",
    "Conduct real-time text translation",
    "Conduct semantic similarity analysis",
    "Conduct sentiment analysis for feedback",
    "Conduct sentiment analysis for tweets",
    "Conduct social network analysis",
    "Conduct time series anomaly detection",
    "Conduct topic modeling for text documents",
    "Conduct user research",
    "Create a recommendation engine for products",
    "Create anomaly detection for cybersecurity logs",
    "Create automated test cases",
    "Create data caching mechanism",
    "Create recommendation system using collaborative filtering",
    "Create RESTful APIs",
    "Create speech synthesis model",
    "Create trend prediction model for fashion",
    "Create wireframes and prototypes",
    "Deploy ML model on mobile device",
    "Deploy model for real-time predictions",
    "Design a convolutional neural network for object detection",
    "Design adversarial examples for model testing",
    "Design and deploy a model for personalized search",
    "Design for accessibility",
    "Develop a chatbot with emotion detection",
    "Develop AI model for medical diagnosis",
    "Develop an API",
    "Develop authentication system",
    "Develop chatbot for customer support",
    "Develop deepfake detection model",
    "Develop deepfake video generator",
    "Develop document retrieval model for search engines",
    "Develop document similarity for plagiarism detection",
    "Develop face detection feature",
    "Develop fraud detection system",
    "Develop image colorization model",
    "Develop image super-resolution using deep learning",
    "Develop interactive designs",
    "Develop ML model for credit scoring",
    "Develop personalized ad targeting model",
    "Develop predictive text input system",
    "Develop real-time video analytics for surveillance",
    "Develop real-time weather forecasting model",
    "Develop recommendation system based on user ratings",
    "Develop REST API for user management",
    "Develop RESTful APIs",
    "Develop stock price prediction model",
    "Develop text generation model",
    "Develop text-to-image generation",
    "Implement a zero-shot learning model",
    "Implement audio processing for speech recognition",
    "Implement authentication and authorization",
    "Implement authentication mechanisms",
    "Implement automated machine learning (AutoML)",
    "Implement caching mechanisms",
    "Implement deep reinforcement learning for robotic control",
    "Implement document similarity for plagiarism detection",
    "Implement emotion recognition from audio samples",
    "Implement external payment gateway",
    "Implement face detection feature",
    "Implement fraud detection system",
    "Implement gesture recognition",
    "Implement image data annotation for computer vision",
    "Implement interactive designs",
    "Implement key phrase extraction from text",
    "Implement model for fraudulent credit card transaction detection",
    "Implement Named Entity Recognition (NER)",
    "Implement natural language processing for text analysis",
    "Implement noise reduction in audio files",
    "Implement personality prediction from social media",
    "Implement predictive text input system",
    "Implement real-time object detection on video streams",
    "Implement real-time object tracking in sports videos",
    "Implement real-time recommendations on streaming data",
    "Implement real-time text translation",
    "Implement real-time translation for multilingual customer support",
    "Implement regression model for sales prediction",
    "Implement reinforcement learning for game AI",
    "Implement reinforcement learning for stock trading",
    "Implement sentiment analysis for feedback",
    "Implement style transfer for images",
    "Implement text sentiment analysis for product reviews",
    "Implement third-party services",
    "Implement transfer learning for image classification",
    "Implement user authentication",
    "Implement user feedback",
    "Implement voice cloning model",
    "Integrate external payment gateway",
    "Integrate third-party services",
    "Manage database operations",
    "Optimize database queries",
    "Optimize database queries for performance",
    "Optimize server performance",
    "Perform dimensionality reduction for high-dimensional data",
    "Perform hyperparameter tuning",
    "Perform real-time anomaly detection on IoT data",
    "Set up a customer churn prediction model",
    "Set up continuous integration for testing",
    "Set up data labeling workflow for supervised learning",
    "Set up data pipeline for ML model training",
    "Set up end-to-end ML pipeline in production",
    "Set up facial emotion recognition system",
    "Set up fraud detection system using anomaly detection",
    "Set up image data annotation for computer vision",
    "Set up ML experiment tracking",
    "Set up real-time recommendations on streaming data",
    "Set up real-time translation for multilingual customer support",
    "Train a language translation model",
    "Train conversational AI for mental health support",
    "Train entity linking model for knowledge graph",
    "Train image captioning model",
    "Train model for autonomous driving",
    "Train model for entity recognition in healthcare",
    "Train model for gesture recognition",
    "Train model for image recognition",
    "Train model for image segmentation",
    "Train model for text-to-image generation",
    "Train multi-label classification model",
    "Train object detection model on custom dataset",
    "Train real-time face authentication model",
    "Train text classification model",
    "Train time series model for demand forecasting",
    "Other",
  ];

  // Define available categories
  const categories = [
    "backend",
    "devops",
    "testing",
    "project management",
    "frontend",
    "cloud",
    "database administration",
    "deployment",
    "documentation",
    "data science",
    "ui/ux design",
    "ai/ml",
    "database",
  ];

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    setError("");
    setSuccess("");
  };

  // Deadline validation function
  const validateDeadline = (deadline) => {
    const today = new Date("2025-03-10"); // Current date as per system info
    const selectedDate = new Date(deadline);
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    if (selectedDate < today) {
      return "Deadline cannot be in the past.";
    }
    if (selectedDate > sixMonthsFromNow) {
      return "Deadline cannot be more than 6 months from today.";
    }
    return "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate deadline
    const deadlineError = validateDeadline(task.deadline);
    if (deadlineError) {
      setError(deadlineError);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Please log in to add a task.");
        setTimeout(() => navigate("/SignIn"), 2000);
        return;
      }

      const response = await axios.post(
        "http://localhost:3030/tasks/add",
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      setTask({
        description: "",
        category: "",
        deadline: "",
        budget: "",
      });
      setTimeout(() => navigate("/ClientDash"), 2000);
    } catch (error) {
      console.error("Error submitting task:", error);
      setError(error.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        padding: "0",
      }}
    >
      <NavBar />
      <div className="container mt-5 mb-5">
        <h2
          className="text-center mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600",
            color: "#2c3e50",
          }}
        >
          Add a New Task
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "15px",
                backgroundColor: "#fff",
                padding: "30px",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {success && (
                <div className="alert alert-success text-center" role="alert">
                  {success}
                </div>
              )}
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label
                    htmlFor="descriptionDropdown"
                    className="form-label"
                    style={{ fontWeight: "500", color: "#34495e" }}
                  >
                    Task Description
                  </label>
                  <select
                    className="form-control"
                    id="descriptionDropdown"
                    name="description"
                    value={task.description}
                    onChange={inputHandler}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <option value="">-- Select Task Description --</option>
                    {taskDescriptions.map((desc, index) => (
                      <option key={index} value={desc}>
                        {desc}
                      </option>
                    ))}
                  </select>
                  {task.description === "Other" && (
                    <input
                      type="text"
                      className="form-control mt-2"
                      id="customDescription"
                      name="description"
                      value={task.description === "Other" ? "" : task.description}
                      onChange={(e) =>
                        setTask({ ...task, description: e.target.value })
                      }
                      placeholder="Enter custom task description"
                      required
                      style={{
                        borderRadius: "8px",
                        padding: "12px",
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                      }}
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="form-label"
                    style={{ fontWeight: "500", color: "#34495e" }}
                  >
                    Category
                  </label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={task.category}
                    onChange={inputHandler}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="deadline"
                    className="form-label"
                    style={{ fontWeight: "500", color: "#34495e" }}
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    value={task.deadline}
                    onChange={inputHandler}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="budget"
                    className="form-label"
                    style={{ fontWeight: "500", color: "#34495e" }}
                  >
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="budget"
                    name="budget"
                    value={task.budget}
                    onChange={inputHandler}
                    placeholder="e.g., 500"
                    min="1"
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    background: "linear-gradient(90deg, #3498db, #2980b9)",
                    color: "#fff",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transition: "background 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "linear-gradient(90deg, #2980b9, #3498db)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "linear-gradient(90deg, #3498db, #2980b9)")
                  }
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;