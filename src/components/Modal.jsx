import React, { useEffect } from 'react';

const Modal = ({ task, closeModal, isEditing, saveTask, formData, setFormData }) => {
  useEffect(() => {
    if (task) {
      setFormData({ 
        title: task.title, 
        description: task.description, 
        dueDate: task.dueDate || '' // Initialize dueDate in formData
      });
    } else {
      setFormData({ 
        title: '', 
        description: '', 
        dueDate: '' // Reset form data for new task
      });
    }
  }, [task, setFormData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedTask = { 
      ...task, 
      title: formData.title, 
      description: formData.description,
      dueDate: formData.dueDate // Include dueDate when saving
    };
    saveTask(updatedTask);
  };

  if (!task && !isEditing) return null; // Close modal if not editing and no task

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? 'Edit Task' : 'Task Details'}</h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Due Date:
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Title: {task.title}</h3>
            <p>Description: {task.description}</p>
            <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date set'}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
            >
              Save
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Close
            </button>
          )}
          <button
            onClick={closeModal}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
