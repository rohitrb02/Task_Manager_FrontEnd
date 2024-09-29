import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Task from "./Task"; // Assuming you have this component
import Modal from "./Modal"; // Create a Modal component for task details or editing
import { useNavigate } from "react-router-dom"; // Corrected navigation
import BASE_URL from '../services/helper';
import { RotatingLines } from "react-loader-spinner"; // Import spinner from react-loader-spinner (optional)
import '../App.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await axios.get(`${BASE_URL}/api/tasks`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTasks();
  }, []);

  const moveTask = async (taskId, newColumn) => {
    setLoading(true); // Set loading to true before moving task
    try {
      await axios.put(
        `${BASE_URL}/api/tasks/${taskId}`,
        { column: newColumn },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, column: newColumn } : task
        )
      );
    } catch (error) {
      console.error("Error moving task:", error);
    } finally {
      setLoading(false); // Set loading to false after moving task
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true); // Set loading to true before deleting
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false); // Set loading to false after deleting
    }
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setFormData({ title: task.title, description: task.description });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const viewDetails = (task) => {
    setSelectedTask(task);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setFormData({ title: '', description: '' });
  };

  const saveTask = async (updatedTask) => {
    if (!updatedTask.title || !updatedTask.description) {
      alert("Title and description are required!");
      return;
    }

    setLoading(true); // Set loading to true before saving
    try {
      if (updatedTask._id) {
        // Updating an existing task
        await axios.put(
          `${BASE_URL}/api/tasks/${updatedTask._id}`,
          updatedTask,
          {
            headers: { Authorization: `${localStorage.getItem("token")}` },
          }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      } else {
        // Adding a new task
        const response = await axios.post(`${BASE_URL}/api/tasks`, updatedTask, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save the task. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after saving
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setFormData({ title: '', description: '' });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "date") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  const columns = [
    { name: "To Do", color: "bg-gray-300" },
    { name: "In Progress", color: "bg-blue-300" },
    { name: "Done", color: "bg-green-300" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard">
        {/* Loading indicator with CSS spinner */}
        {loading && (
          <div className="loading-indicator">
            {/* Spinner from react-loader-spinner */}
            <RotatingLines
              strokeColor="blue"
              strokeWidth="5"
              animationDuration="0.75"
              width="50"
              visible={true}
            />
          </div>
        )}

        <button
          onClick={handleAddTask}
          className="mb-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
        >
          Add Task
        </button>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded-lg px-4 py-2 w-1/3"
          />

          <select
            value={sortOption}
            onChange={handleSort}
            className="border rounded-lg px-4 py-2"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {columns.map(({ name, color }) => (
            <TaskColumn
              key={name}
              column={name}
              tasks={filteredTasks.filter((task) => task.column === name)}
              moveTask={moveTask}
              deleteTask={deleteTask}
              editTask={editTask}
              viewDetails={viewDetails}
              columnColor={color}
            />
          ))}
        </div>

        {/* Modal for adding/editing tasks */}
        {isModalOpen && (
          <Modal
            task={selectedTask}
            closeModal={closeModal}
            isEditing={isEditing}
            saveTask={saveTask}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </DndProvider>
  );
};

const TaskColumn = React.memo(({ column, tasks, moveTask, deleteTask, editTask, viewDetails, columnColor }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => moveTask(item.id, column),
  });

  return (
    <div className={`p-4 rounded-lg shadow-md ${columnColor}`} ref={drop}>
      <h3 className="text-xl font-semibold mb-2">{column}</h3>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          deleteTask={deleteTask}
          editTask={editTask}
          viewDetails={viewDetails}
        />
      ))}
    </div>
  );
});

export default Dashboard;
