const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const {
  registrationValidation,
} = require("../utils/validations/registerValidation");

router.post("/register", registrationValidation, authController.register);

router.post("/login", authController.login);

// router.get('/logout', authController.logout);

router.get(
  "/profile",
  authController.ensureAuthenticated,
  authController.profile
);

module.exports = router;
