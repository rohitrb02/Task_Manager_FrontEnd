import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ task, deleteTask, editTask, viewDetails }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Function to determine the status label and style
  const getStatusLabel = (column) => {
    switch (column) {
      case 'To Do':
        return { label: 'Backlog', color: 'text-gray-500' };
      case 'In Progress':
        return { label: 'In Progress', color: 'text-blue-500' };
      case 'Done':
        return { label: 'Closed', color: 'text-green-500' };
      default:
        return { label: 'Unknown', color: 'text-gray-400' };
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  // Check if the due date is within the next 5 days
  const isDueSoon = () => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const currentDate = new Date();
      const timeDifference = dueDate - currentDate;
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert ms to days
      return dayDifference >= 0 && dayDifference <= 5; // Due date is within the next 5 days
    }
    return false;
  };

  // Calculate remaining days
  const getRemainingDays = () => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const currentDate = new Date();
      const timeDifference = dueDate - currentDate;
      return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert ms to days
    }
    return null; // No due date set
  };

  const status = getStatusLabel(task.column);
  const remainingDays = getRemainingDays();

  return (
    <div
      className={`bg-white p-4 mb-4 rounded-lg shadow-lg transition-transform transform ${
        isDragging ? 'opacity-50' : ''
      }`}
      ref={drag}
    >
      {/* Status Label */}
      <span className={`inline-block text-sm font-bold mb-2 ${status.color}`}>
        Status: {status.label}
      </span>
      <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-gray-600">
        Created Date: {formatDate(task.createdAt)}
      </p>
      {/* Conditionally style the Due Date */}
      <p className={`text-gray-600 font-bold ${isDueSoon() ? 'text-red-500 font-bold' : ''}`}>
        Due Date: {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
      </p>
      {/* Display remaining days with conditional styling */}
      {remainingDays !== null && (
        <p className={`text-gray-600 ${remainingDays < 5 ? 'text-red-500' : ''}`}>
          Remaining Days: {remainingDays >= 0 ? remainingDays : 'Overdue'}
        </p>
      )}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => viewDetails(task)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
        >
          View Details
        </button>
        <button
          onClick={() => editTask(task)}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-300"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
