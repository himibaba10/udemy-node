const express = require("express");
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

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.post("/reset", postResetPassword);
router.post("/new-password", postNewPassword);

module.exports = router;
