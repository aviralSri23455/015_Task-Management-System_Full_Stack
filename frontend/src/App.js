import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './Component/TaskList';
import TaskForm from './Component/TaskForm';
import EditTaskForm from './Component/EditTaskForm';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    // Fetch tasks when the component is mounted
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get('http://127.0.0.1:5000/tasks')  // Adjust the URL if needed
      .then((response) => setTasks(response.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  const createTask = (newTask) => {
    axios
      .post('http://127.0.0.1:5000/tasks', newTask)
      .then((response) => setTasks([...tasks, response.data]))  // Add the new task
      .catch((err) => console.error('Error creating task:', err));
  };

  const updateTask = (updatedTask) => {
    axios
      .put(`http://127.0.0.1:5000/tasks/${updatedTask._id}`, updatedTask)
      .then(() => {
        const updatedTasks = tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        setTasks(updatedTasks);
        setEditTask(null);  // Exit edit mode
      })
      .catch((err) => console.error('Error updating task:', err));
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://127.0.0.1:5000/tasks/${taskId}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== taskId)))
      .catch((err) => console.error('Error deleting task:', err));
  };

  const completeTask = (taskId) => {
    axios
      .put(`http://127.0.0.1:5000/tasks/${taskId}/complete`)
      .then(() => fetchTasks())  // Refresh tasks after completion
      .catch((err) => console.error('Error completing task:', err));
  };

  return (
    <div>
      <h1>Task Management System</h1>
      <TaskForm onCreate={createTask} />
      <TaskList
        tasks={tasks}
        onEdit={setEditTask}  // Set edit task
        onDelete={deleteTask}  // Delete handler
        onComplete={completeTask}  // Complete handler
      />
      {editTask && (
        <EditTaskForm
          task={editTask}
          onUpdate={updateTask}  // Update handler
          onCancel={() => setEditTask(null)}  // Cancel handler
        />
      )}
    </div>
  );
};

export default App;
