import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Not authorized or session expired");
      navigate("/login");
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post("/todos", { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const toggleTodo = async (id) => {
    const res = await axios.put(`/todos/${id}`);
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const updateTodo = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await axios.put(`/todos/${id}/update`, { text: editingText });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Failed to update:", error.response?.data || error.message);
    }
  };

  const handleLogout = async () => {
    await axios.post("/auth/logout");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600">Todo List</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center mb-6 space-x-2">
          <input
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a new todo..."
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Add
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No todos yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border hover:shadow-md transition"
              >
                {editingId === todo._id ? (
                  <>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded mr-2"
                    />
                    <button
                      onClick={() => updateTodo(todo._id)}
                      className="text-green-600 hover:text-green-800 font-medium mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => toggleTodo(todo._id)}
                      className={`flex-1 cursor-pointer ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditingText(todo.text);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
