const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/note.routes");

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

connectDB().catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exit(1);
});

const app = express();

app.use(express.json());
app.use("/api/notes", noteRoutes);

module.exports = app;