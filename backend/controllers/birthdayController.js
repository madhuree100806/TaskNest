const pool = require("../config/db");

exports.getBirthdays = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, date, relation
       FROM birthdays
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createBirthday = async (req, res, next) => {
  try {
    const { name, date, relation = "" } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        message: "Name and date are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO birthdays
       (name, date, relation)
       VALUES ($1, $2, $3)
       RETURNING id, name, date, relation`,
      [name, date, relation]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateBirthday = async (req, res, next) => {
  try {
    const { name, date, relation } = req.body;

    const result = await pool.query(
      `UPDATE birthdays
       SET name = COALESCE($1, name),
           date = COALESCE($2, date),
           relation = COALESCE($3, relation)
       WHERE id = $4
       RETURNING id, name, date, relation`,
      [name, date, relation, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Birthday not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteBirthday = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM birthdays WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Birthday not found",
      });
    }

    res.json({
      message: "Birthday deleted",
    });
  } catch (error) {
    next(error);
  }
};