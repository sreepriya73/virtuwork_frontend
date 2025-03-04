import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewAcceptedTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3030/tasks/accepted');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching accepted tasks:', error);
      }
    };

    fetchAcceptedTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Accepted Tasks By Admin</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px' }}>
            <p><strong>Task ID:</strong> {task._id}</p> {/* Added Task ID */}
             <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
             <p><strong>Client ID:</strong> {task.ClientId?._id || "N/A"}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAcceptedTasks;
