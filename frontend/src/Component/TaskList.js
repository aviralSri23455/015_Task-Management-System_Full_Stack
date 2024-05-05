import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete, onComplete }) => {
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.sr_no}. {task.name} - {task.task} - {task.pending ? 'Pending' : 'Completed'}
            - Deadline: {task.deadline}
            {task.reminder_date && ` - Reminder: ${task.reminder_date}`}  {/* Display reminder date */}
            {task.pending_date && ` - Pending Since: ${task.pending_date}`}
            {task.completion_date && ` - Completed On: ${task.completion_date}`}
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onDelete(task._id)}>Delete</button>
            {task.pending && <button onClick={() => onComplete(task._id)}>Complete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
