import { useEffect, useState } from "react";
import CircularGallery from "../components/ui/CircularGallery/CircularGallery";
import SpecularButton from "../components/ui/SpecularButton/SpecularButton";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTodos();

      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load tasks. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const newTodo = await createTodo({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });

      setTodos((prev) => [...prev, newTodo]);

      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Unable to create task.");
      console.error(err);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const id = todo.id || todo._id;

      const updatedTodo = await updateTodo(id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((item) => ((item.id || item._id) === id ? updatedTodo : item))
      );
    } catch (err) {
      setError("Unable to update task.");
      console.error(err);
    }
  };

  const handleDelete = async (todo) => {
    try {
      const id = todo.id || todo._id;

      await deleteTodo(id);

      setTodos((prev) => prev.filter((item) => (item.id || item._id) !== id));
    } catch (err) {
      setError("Unable to delete task.");
      console.error(err);
    }
  };

  return (
    <div className="page todo-page">
      <div className="page-header">
        <div>
          <h1>Todo Manager</h1>
        </div>
      </div>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <SpecularButton type="submit">Add Task</SpecularButton>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Add your first task above.</p>
        </div>
      ) : (
        <section className="gallery-section">
          <div className="todo-gallery">
            <CircularGallery todos={todos} onToggle={handleToggle} onDelete={(id) => handleDelete({ id })} />
          </div>
        </section>
      )}
    </div>
  );
}

export default TodoPage;
