const pool = require("../config/db");

exports.getResources = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, url, category, description
       FROM resources
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const {
      title,
      url,
      category = "Other",
      description = "",
    } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        message: "Title and url are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO resources
       (title, url, category, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, url, category, description`,
      [title, url, category, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const {
      title,
      url,
      category,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE resources
       SET title = COALESCE($1, title),
           url = COALESCE($2, url),
           category = COALESCE($3, category),
           description = COALESCE($4, description)
       WHERE id = $5
       RETURNING id, title, url, category, description`,
      [title, url, category, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM resources WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.json({
      message: "Resource deleted",
    });
  } catch (error) {
    next(error);
  }
};