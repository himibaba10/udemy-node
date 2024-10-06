const express = require("express");
const { check } = require("express-validator");
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

const router = express.Router();

router.get("/signup", getSignup);
router.get("/login", getLogin);
router.get("/reset", getResetPassword);
router.get("/reset/:token", getNewPassword);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password")
      .isLength({ min: 6, max: undefined })
      .isAlphanumeric()
      .withMessage("Password must be at least 6 characters"),
  ],
  postSignup
);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.post("/reset", postResetPassword);
router.post("/new-password", postNewPassword);

module.exports = router;
