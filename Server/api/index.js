const express = require("express");
const cors = require("cors");
const drawingRoutes = require("./routes/drawingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the drawing routes
app.use("/api", drawingRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Whiteboard App API is running on Vercel!");
});

module.exports = app;
