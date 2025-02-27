import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3030/tasks/all');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/tasks/delete/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      alert('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task');
    }
  };

  // Accept a task
  const acceptTask = async (id) => {
    try {
      await axios.put(`http://localhost:3030/tasks/accept/${id}`);
      alert('Task accepted successfully');
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('Error accepting task');
    }
  };

  

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Tasks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px' }}>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> ${task.budget}</p>
            <div style={{ marginTop: '10px' }}>
             
              <button 
                onClick={() => deleteTask(task._id)} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Delete
              </button>
              <button 
                onClick={() => acceptTask(task._id)} 
                style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Accept
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTasks;
