import { useEffect, useRef, useState } from "react";
import "./CircularGallery.css";

export default function CircularGallery({
  todos = [],
  onToggle,
  onDelete,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    if (activeIndex >= todos.length) {
      setActiveIndex(
        Math.max(0, todos.length - 1)
      );
    }
  }, [todos, activeIndex]);

  const next = () => {
    if (!todos.length) return;

    setActiveIndex(
      (prev) =>
        (prev + 1) % todos.length
    );
  };

  const previous = () => {
    if (!todos.length) return;

    setActiveIndex(
      (prev) =>
        (prev - 1 + todos.length) %
        todos.length
    );
  };

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      next();
    } else {
      previous();
    }
  };

  if (!todos.length) {
    return (
      <div className="todo-gallery-empty">
        <div className="empty-icon">✓</div>

        <h3>No tasks yet</h3>

        <p>
          Add your first task to see it
          here.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={galleryRef}
      className="todo-circular-gallery"
      onWheel={handleWheel}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          next();
        }

        if (event.key === "ArrowLeft") {
          previous();
        }
      }}
    >
      <div className="todo-gallery-stage">
        {todos.map((todo, index) => {
          let offset =
            index - activeIndex;

          const total =
            todos.length;

          if (
            offset >
            total / 2
          ) {
            offset -= total;
          }

          if (
            offset <
            -total / 2
          ) {
            offset += total;
          }

          const distance =
            Math.abs(offset);

          const isActive =
            offset === 0;

          return (
            <div
              key={
                todo.id ??
                `${todo.title}-${index}`
              }
              className={`todo-gallery-card ${
                isActive
                  ? "active"
                  : ""
              } ${
                todo.completed
                  ? "completed"
                  : ""
              }`}
              style={{
                "--offset": offset,
                "--distance": distance,
              }}
              onClick={() =>
                setActiveIndex(index)
              }
            >
              <div className="todo-card-content">

                <div className="todo-card-number">
                  {index + 1}
                </div>

                <div className="todo-card-status">
                  {todo.completed
                    ? "✓ COMPLETED"
                    : "○ PENDING"}
                </div>

                <h3>
                  {todo.title ||
                    todo.task ||
                    "Untitled Task"}
                </h3>

                {todo.description && (
                  <p>
                    {todo.description}
                  </p>
                )}

                {todo.dueDate && (
                  <div className="todo-card-date">
                    📅 {todo.dueDate}
                  </div>
                )}

                {isActive && (
                  <div className="todo-card-actions">

                    {onToggle && (
                      <button
                        className="todo-complete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(todo);
                        }}
                      >
                        {todo.completed
                          ? "Mark Pending"
                          : "Complete"}
                      </button>
                    )}

                    {onDelete && (
                      <button
                        className="todo-delete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(todo.id);
                        }}
                      >
                        Delete
                      </button>
                    )}

                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      <button
        className="gallery-arrow gallery-arrow-left"
        onClick={previous}
        aria-label="Previous task"
      >
        ‹
      </button>

      <button
        className="gallery-arrow gallery-arrow-right"
        onClick={next}
        aria-label="Next task"
      >
        ›
      </button>

      <div className="gallery-indicator">
        {activeIndex + 1} / {todos.length}
      </div>

      <p className="gallery-hint">
        Use ← → or scroll to browse tasks
      </p>
    </div>
  );
}