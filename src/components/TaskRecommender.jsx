// src/TaskRecommender.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskRecommender = () => {
  const [skill, setSkill] = useState('');
  const [category, setCategory] = useState('');
  const [recommendedTask, setRecommendedTask] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRecommendedTask(null);

    try {
      const response = await axios.post('http://localhost:3030/api/recommend-task', {
        skill,
        category
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setRecommendedTask(response.data.recommendedTask);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendation');
      console.error('Error:', err.response?.data || err.message); // Enhanced debugging
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Task Recommender</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recommendedTask && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          Recommended Task: {recommendedTask}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="skill" style={{ display: 'block', marginBottom: '5px' }}>
            Skill:
          </label>
          <input
            type="text"
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., spring boot"
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>
            Category:
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., backend"
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Get Recommendation
        </button>
      </form>
    </div>
  );
};

export default TaskRecommender; // Ensure default export