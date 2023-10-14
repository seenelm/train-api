const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");

const MongoDB = require("./src/datastore/MongoDB");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const groupRoutes = require("./src/routes/groupRoutes");

const dbUri = config.get("MongoDB.dbConfig.host");
const port = config.get("MongoDB.dbConfig.port");

const db = new MongoDB(dbUri);

app.use(async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    await db.connect();
  }
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

const server = app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});

process.on("SIGINT", () => {
  db.close().then(() => {
    process.exit(0);
  });
});

module.exports = { app, server };
