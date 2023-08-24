const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateUser } = require("../__middleware__/validateUser");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

router.get("/:userId", usersController.showGroups);

router.post("/login", authController.login);

router.post("/signup", validateUser, authController.register);

module.exports = router;
