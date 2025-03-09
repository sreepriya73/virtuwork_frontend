import React, { useState } from 'react';

const TaskRecommender = () => {
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3030/api/predict', { // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          skill,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_task_description);
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

  return (
    <div>
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
        input { padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background-color: #cccccc; cursor: not-allowed; }
        button:hover:not(:disabled) { background-color: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background-color: #e9ffe9; border: 1px solid #b3ffb3; border-radius: 4px; }
        .error { margin-top: 20px; padding: 15px; background-color: #ffe6e6; border: 1px solid #ff9999; border-radius: 4px; }
        .result h3, .error h3 { margin: 0 0 10px 0; color: #333; }
        .result p, .error p { margin: 0; color: #555; }
      `}</style>

      <div className="task-recommender-container">
        <h1>Task Recommender</h1>
        <p>Enter a category and skill to get a recommended task description.</p>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Development"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skill">Skill:</label>
            <input
              type="text"
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., Python"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Predicting...' : 'Get Task Recommendation'}
          </button>
        </form>
        {prediction && (
          <div className="result">
            <h3>Recommended Task Description:</h3>
            <p>{prediction}</p>
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