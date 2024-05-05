import React from 'react';

const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  if (!task) {
    return null;  // If no task is provided, return nothing
  }

  const taskCopy = { ...task };

  const handleChange = (key, value) => {
    taskCopy[key] = value;  // Update the local copy
  };

  const handleCheckboxChange = (key, isChecked) => {
    if (key === 'pending') {
      taskCopy[key] = isChecked;
      if (isChecked) {
        taskCopy['completed'] = !isChecked;  // Ensure only one is checked
      }
    } else if (key === 'completed') {
      taskCopy[key] = isChecked;
      if (isChecked) {
        taskCopy['pending'] = !isChecked;  // Ensure only one is checked
      }
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <input
        type="number"
        placeholder="Serial number"
        value={taskCopy.sr_no}
        onChange={(e) => handleChange('sr_no', e.target.value)}
      />
      <input
        type="text"
        placeholder="Task name"
        value={taskCopy.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Task description"
        value={taskCopy.task}
        onChange={(e) => handleChange('task', e.target.value)}
      />
      <div>
        <label>
          Pending:
          <input
            type="checkbox"
            checked={taskCopy.pending}
            onChange={(e) => handleCheckboxChange('pending', e.target.checked)}
          />
        </label>
        <label>
          Completed:
          <input
            type="checkbox"
            checked={!taskCopy.pending}  // If not pending, it's completed
            onChange={(e) => handleCheckboxChange('completed', e.target.checked)}
          />
        </label>
      </div>
      <input
        type="date"
        placeholder="Deadline"
        value={taskCopy.deadline}
        onChange={(e) => handleChange('deadline', e.target.value)}
      />
      <button onClick={() => onUpdate(taskCopy)}>Update Task</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  );
};

export default EditTaskForm;
