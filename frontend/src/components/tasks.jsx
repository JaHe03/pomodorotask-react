import { useState, useEffect } from "react";
import api from "../api";

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title || !text) {
      alert("Please fill out all fields!");
      return;
    }

    setLoading(true);

    try {
      await api.post("api/tasks/", { title, text });
      fetchTasks();
      setText("");
      setTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={createTask}
      className="bg-[var(--bg-primary)] shadow-lg rounded-2xl p-8"
    >
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center">
        Create Task
      </h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-md p-2 mt-4"
      />
      <textarea // css
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-2 mt-4"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded-md p-2 mt-4"
      >
        {loading ? "Loading..." : "Create Task"}
      </button>
    </form>
  );
};

const TaskList = ({ tasks, fetchTasks }) => {
  const deleteTask = async (id) => {
    try {
      await api.delete(`api/tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="border p-2 my-2 flex justify-between">
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-[var(--text-primary)]">{task.text}</p>
          </div>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white p-2"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    api
      .get("api/tasks/")
      .then((res) => res.data)
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  return (
    <>
      {/* Button to Open Sidebar */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 bg-[var(--bg-button)] text-white py-2 px-4 rounded hover:bg-[var(--bg-button-hover)] z-10 open-settings-btn"
      >
        Open Tasks
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-50 bg-[var(--bg-sidebar)] text-[var(--text-primary)] shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Tasks</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500">
            ✖
          </button>
        </div>
        <div className="p-4">
          <TaskForm fetchTasks={fetchTasks} />
          <TaskList tasks={tasks} fetchTasks={fetchTasks} />
        </div>
      </div>

    </>
  );
};

export default Tasks;
