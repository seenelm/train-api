const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");

const dbUri =
  process.env.NODE_ENV === "dev" ? process.env.DEV_DB_URI : process.env.DB_URI;

console.log("DB URI:", dbUri);

// dbUri = process.env.DB_URI;

mongoose.connect(dbUri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api/groups", groupRoutes);

const server = app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000");
});

module.exports = { app, server };
