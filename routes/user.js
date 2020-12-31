const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { getUserById, getUser, resetPassword } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

router.post(
  "/reset-password",
  [check("email").isEmail().withMessage("Invalid Email")],
  isSignedIn,
  isAuthenticated,
  resetPassword
);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

module.exports = router;
