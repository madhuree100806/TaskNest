const pool = require("../config/db");

exports.getTodos = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description,
              due_date AS "dueDate", completed
       FROM todos
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { title, description = "", dueDate = "" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO todos
       (title, description, due_date, completed)
       VALUES ($1, $2, $3, false)
       RETURNING id, title, description,
                 due_date AS "dueDate", completed`,
      [title.trim(), description, dueDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { title, description, dueDate, completed } = req.body;

    const result = await pool.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = COALESCE($3, due_date),
           completed = COALESCE($4, completed)
       WHERE id = $5
       RETURNING id, title, description,
                 due_date AS "dueDate", completed`,
      [title, description, dueDate, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json({
      message: "Todo deleted",
    });
  } catch (error) {
    next(error);
  }
};