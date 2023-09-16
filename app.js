const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const groupRoutes = require("./src/routes/groupRoutes");

let dbUri;

switch (process.env.NODE_ENV) {
  case "testing":
    dbUri = process.env.TEST_DB_URI;
    break;
  case "production":
    dbUri = process.env.PROD_DB_URI;
    break;
  default:
    dbUri = process.env.DEV_DB_URI;
}

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

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

const server = app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000");
});

module.exports = { app, server };
