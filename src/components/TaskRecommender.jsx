import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const taskData = [
  { description: "Implement user authentication", category: "backend", skill: "spring boot" },
  { description: "Optimize server performance", category: "backend", skill: "asp.net" },
  { description: "Manage database operations", category: "backend", skill: "django" },
  { description: "Implement user authentication", category: "backend", skill: "api" },
  { description: "Build a microservice", category: "backend", skill: "kotlin" },
  { description: "Optimize server performance", category: "backend", skill: "laravel" },
  { description: "Implement user authentication", category: "backend", skill: "spring boot" },
  { description: "Optimize server performance", category: "backend", skill: "c" },
  { description: "Optimize server performance", category: "backend", skill: "C++" },
  { description: "Optimize server performance", category: "backend", skill: "go" },
  { description: "Build predictive model for user behavior", category: "ai/ml", skill: "tensorflow" },
  { description: "Train model for image recognition", category: "ai/ml", skill: "pytorch" },
  { description: "Set up data pipeline for ML model training", category: "ai/ml", skill: "apache spark" },
  { description: "Deploy model for real-time predictions", category: "ai/ml", skill: "docker" },
  { description: "Implement sentiment analysis for feedback", category: "ai/ml", skill: "nltk" },
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
  "Others" // Added "Others"
];

// Define available skills (sorted and deduplicated)
const skills = [
  "ADTK", "Adobe XD", "Alibi Detect", "ALS", "Apache Flink", "Apache Spark", "api", "ARIMA", "asp.net",
  "Augmentor", "BERT", "BioBERT", "BM25", "BorutaPy", "C", "C++", "Carla", "CatBoost", "Cleverhans",
  "CNN", "CRNN", "database", "DeepRecSys", "DeepSpeech", "DenseNet", "Dialogflow", "django", "Dlib",
  "Docker", "Doc2Vec", "DQN", "EfficientNet", "Elasticsearch", "ESRGAN", "FaceNet", "FastText",
  "Faster R-CNN", "FeatureTools", "FER (Facial Expression Recognition)", "Figma", "flask", "go",
  "GPT-2", "GPT-2 Fine-Tuning", "GPT-3", "H2O.ai", "Hugging Face", "Isolation Forest", "java",
  "Jenkins", "JMeter", "JWT", "keras", "kotlin", "Kubeflow", "Labelbox", "laravel", "LDA", "Librosa",
  "LightGBM", "Linear Regression", "LIWC", "LSTM", "MarianMT", "Matrix Factorization", "MediaPipe",
  "MLflow", "MobileNet", "NetworkX", "NLTK", "node.js", "OpenCV", "OpenKE", "OpenPose", "Optuna",
  "Pandas", "PCA", "php", "Polyglot", "Praat", "Prophet", "Proximal Policy Optimization", "PyCaret",
  "python", "pytorch", "RandomForest", "Rasa", "RAKE", "redis", "Recurrent Neural Networks (RNN)",
  "ruby", "rust", "scala", "scikit-learn", "scikit-multilearn", "Selenium", "Sentence-BERT",
  "Show and Tell", "Sketch", "SORT", "spaCy", "spring boot", "SQL", "Stable Baselines", "StyleGAN",
  "Supervisely", "SV2TTS", "Tacotron", "TensorFlow", "TensorFlow Lite", "TensorFlow-GAN", "Tesseract",
  "TextBlob", "Transformer", "U-Net", "UserTesting", "VADER", "Wave-U-Net", "WCAG", "Xception",
  "XGBoost", "YOLO", "YOLOv4", "YOLOv5", "Zero-shot BERT", "Others" // Added "Others"
];

const TaskRecommender = () => {
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // For custom category input
  const [skill, setSkill] = useState('');
  const [customSkill, setCustomSkill] = useState(''); // For custom skill input
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction('');
    setLoading(true);

    // Use custom values if "Others" is selected, otherwise use dropdown values
    const finalCategory = category === "Others" ? customCategory : category;
    const finalSkill = skill === "Others" ? customSkill : skill;

    if (!finalCategory || !finalSkill) {
      setError('Please provide both a category and a skill.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: finalCategory,
          skill: finalSkill,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const predictedTask = data.predicted_task_description;
        setPrediction(predictedTask);
        setSearchQuery(predictedTask);
      } else {
        setError(data.error || 'An error occurred while fetching the prediction');
      }
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/ConfirmTask', { state: { searchQuery } });
    }
  };

  return (
    <div>
      <NavBar />
      <style>{`
        .task-recommender-container {
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h1 { text-align: center; color: #333; }
        p { text-align: center; color: #666; }
        .task-form { display: flex; flex-direction: column; gap: 15px; }
        .form-group { display: flex; flex-direction: column; }
        label { margin-bottom: 5px; font-weight: bold; }
        input, select { padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background-color: #cccccc; cursor: not-allowed; }
        button:hover:not(:disabled) { background-color: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background-color: #e9ffe9; border: 1px solid #b3ffb3; border-radius: 4px; }
        .error { margin-top: 20px; padding: 15px; background-color: #ffe6e6; border: 1px solid #ff9999; border-radius: 4px; }
        .result h3, .error h3 { margin: 0 0 10px 0; color: #333; }
        .result p, .error p { margin: 0; color: #555; }
        .search-form { margin-top: 15px; display: flex; gap: 10px; }
        .search-form input { flex: 1; }
        .custom-input { margin-top: 10px; }
      `}</style>

      <div className="task-recommender-container">
        <h1>Task Recommender</h1>
        <p>Enter a category and select a skill to get a recommended task description.</p>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {category === "Others" && (
              <input
                type="text"
                className="custom-input"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type custom category"
                required
              />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="skill">Skill:</label>
            <select
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              required
            >
              <option value="">Select a skill</option>
              {skills.map((skillOption) => (
                <option key={skillOption} value={skillOption}>
                  {skillOption}
                </option>
              ))}
            </select>
            {skill === "Others" && (
              <input
                type="text"
                className="custom-input"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Type custom skill"
                required
              />
            )}
          </div>
          <button type="submit" disabled={loading || !skill || !category || (category === "Others" && !customCategory) || (skill === "Others" && !customSkill)}>
            {loading ? 'Predicting...' : 'Get Task Recommendation'}
          </button>
        </form>
        {prediction && (
          <div className="result">
            <h3>Recommended Task Description:</h3>
            <p>{prediction}</p>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for this task"
              />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
        {error && (
          <div className="error">
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRecommender;