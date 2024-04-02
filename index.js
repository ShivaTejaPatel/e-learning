import express from "express";
import cookieParser from "cookie-parser";
import pool from "./database.js"; // Import the database connection

const app = express();

app.use(express.json());
app.use(cookieParser());

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database:', res.rows[0]);
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));