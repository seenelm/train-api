const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const FitSpace = require("./models/fitspace");

const userRoutes = require("./routes/users");

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

app.post("/fitspaces", async (req, res) => {
  console.log("Request: ", req.body);
  const { fitspaceName } = req.body;
  console.log({ fitspaceName });

  if (!fitspaceName) {
    return res.status(400).json({ error: "Name is required" });
  }
  const fitspace = new FitSpace(req.body);
  await fitspace.save();
});

const server = app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000");
});

module.exports = { app, server };
