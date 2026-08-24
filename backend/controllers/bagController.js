const pool = require("../config/db");

exports.getBagItems = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, quantity, packed
       FROM bag_items
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createBagItem = async (req, res, next) => {
  try {
    const { name, quantity = 1 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Item name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO bag_items
       (name, quantity, packed)
       VALUES ($1, $2, false)
       RETURNING id, name, quantity, packed`,
      [name.trim(), quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateBagItem = async (req, res, next) => {
  try {
    const { name, quantity, packed } = req.body;

    const result = await pool.query(
      `UPDATE bag_items
       SET name = COALESCE($1, name),
           quantity = COALESCE($2, quantity),
           packed = COALESCE($3, packed)
       WHERE id = $4
       RETURNING id, name, quantity, packed`,
      [name, quantity, packed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteBagItem = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM bag_items WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      message: "Item deleted",
    });
  } catch (error) {
    next(error);
  }
};