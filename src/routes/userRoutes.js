const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/:userId", usersController.showGroups);

router.get("/", usersController.findUsers);

router.post("/:userId/groups/:groupId", usersController.requestGroup);

module.exports = router;
