const express = require("express");
const { check, body } = require("express-validator");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

// GET ROUTES
router.get("/signup", getSignup);
router.get("/login", getLogin);
router.get("/reset", getResetPassword);
router.get("/reset/:token", getNewPassword);

// POST ROUTES
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already exists, pick a different one.");
        }
      })
      .normalizeEmail(),
    check("password", "Password must be at least 6 characters and alphanumeric")
      .isLength({ min: 6, max: undefined })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),
  ],
  postSignup
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Not an email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        req.user = user;
        return true;
      })
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password field is required")
      .trim(),
  ],
  postLogin
);
router.post("/logout", postLogout);
router.post("/reset", postResetPassword);
router.post("/new-password", postNewPassword);

module.exports = router;
