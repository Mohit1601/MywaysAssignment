require("dotenv").config();

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

//EMPLOYER ROUTES
router.post(
  "/employer/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long."),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be atleast 5 characters long"),
  ],
  signup
);

router.post(
  "/employer/signin",
  [
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  signin
);

//STUDENT ROUTES
router.post(
  "/student/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long."),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be atleast 5 characters long"),
  ],
  signup
);

router.post(
  "/student/signin",
  [
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
