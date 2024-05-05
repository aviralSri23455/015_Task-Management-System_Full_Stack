import React, { useState } from 'react';

const TaskForm = ({ onCreate }) => {
  const [task, setTask] = useState({
    sr_no: '',
    name: '',
    task: '',
    pending: true,
    completed: false,
    deadline: ''
  });

  const handleCreate = () => {
    if (task.pending && task.completed) {
      alert("A task can't be both pending and completed. Please choose one.");  // Validation
      return;
    }

    onCreate(task);  // Create the new task
    setTask({
      sr_no: '',
      name: '',
      task: '',
      pending: true,
      completed: false,
      deadline: ''
    });  // Reset after creating
  };

  const handleCheckboxChange = (key, isChecked) => {
    setTask((prevTask) => {
      const newTask = { ...prevTask, [key]: isChecked };
      
      if (key === 'pending' && isChecked) {
        newTask.completed = !isChecked;  // If pending is checked, completed is unchecked
      } else if (key === 'completed' && isChecked) {
        newTask.pending = !isChecked;  // If completed is checked, pending is unchecked
      }

      return newTask;
    });
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <input
        type="number"
        placeholder="Serial number"
        value={task.sr_no}
        onChange={(e) => setTask({ ...task, sr_no: e.target.value })}
      />
      <input
        type="text"
        placeholder="Task name"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Task description"
        value={task.task}
        onChange={(e) => setTask({ ...task, task: e.target.value })}
      />
      <div>
        <label>
          Pending:
          <input
            type="checkbox"
            checked={task.pending}
            onChange={(e) => handleCheckboxChange('pending', e.target.checked)}
          />
        </label>
        <label>
          Completed:
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => handleCheckboxChange('completed', e.target.checked)}
          />
        </label>
      </div>
      <input
        type="date"
        placeholder="Deadline"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
      />
      <button onClick={handleCreate}>Create Task</button>
    </div>
  );
};

export default TaskForm;
