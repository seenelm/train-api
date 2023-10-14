const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authenticate = require("../__middleware__/authenticate");

router.get("/:userId", authenticate, usersController.fetchGroups);

router.get("/", authenticate, usersController.findUsers);

module.exports = router;
