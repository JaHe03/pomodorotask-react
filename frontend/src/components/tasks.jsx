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
      className="bg-white shadow-lg rounded-2xl p-8 w-96"
    >
      <h1 className="text-2xl font-bold text-gray-900 text-center">
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
            <p className="text-gray-600">{task.text}</p>
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
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
};

export default Tasks;
