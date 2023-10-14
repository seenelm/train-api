const express = require("express");
const router = express.Router();
const {
  validateRegistration,
  validateLogin,
} = require("../validators/userValidator");
const authController = require("../controllers/authController");

router.post("/register", validateRegistration, authController.register);

router.post("/login", validateLogin, authController.login);

module.exports = router;
