require("dotenv").config();

const express = require("express");
const cors = require("cors");

const todoRoutes = require("./routes/todoRoutes");
const birthdayRoutes = require("./routes/birthdayRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bagRoutes = require("./routes/bagRoutes");
const folderRoutes = require("./routes/folderRoutes");

const errorHandler = require("./middleware/errorHandler");
const pool = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "TaskNest Backend Running 🚀",
  });
});

// Database test route
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/birthdays", birthdayRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bag", bagRoutes);
app.use("/api/folders", folderRoutes);


// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});