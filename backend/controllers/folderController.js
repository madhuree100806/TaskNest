const pool = require("../config/db");

// Get all folders
const getFolders = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM resource_folders ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching folders:", error);
        res.status(500).json({ error: "Failed to fetch folders" });
    }
};

// Create a folder
const createFolder = async (req, res) => {
    try {
        const { name, color } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: "Folder name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO resource_folders (name, color)
             VALUES ($1, $2)
             RETURNING *`,
            [name.trim(), color || "#6366f1"]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ error: "Failed to create folder" });
    }
};

// Delete a folder
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM resource_folders WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Folder not found"
            });
        }

        res.json({
            message: "Folder deleted successfully",
            folder: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting folder:", error);
        res.status(500).json({ error: "Failed to delete folder" });
    }
};

module.exports = {
    getFolders,
    createFolder,
    deleteFolder
};