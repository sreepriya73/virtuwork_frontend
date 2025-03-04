import React, { useState } from "react";
import axios from "axios";

const AddTask = () => {
  const [task, setTask] = useState({
    description: "",
    category: "",
    deadline: "",
    budget: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please log in to add a task.");
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
      alert(response.data.message);
      setTask({
        description: "",
        category: "",
        deadline: "",
        budget: "",
      });
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Failed to add task");
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="description"
          value={task.description}
          onChange={inputHandler}
          placeholder="Task Description"
          required
        />
        <input
          type="text"
          name="category"
          value={task.category}
          onChange={inputHandler}
          placeholder="Category"
          required
        />
        <input
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={inputHandler}
          required
        />
        <input
          type="number"
          name="budget"
          value={task.budget}
          onChange={inputHandler}
          placeholder="Budget"
          required
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;