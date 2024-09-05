const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
} = require("../controllers/auth");

const router = express.Router();

router.get("/signup", getSignup);
router.get("/login", getLogin);

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/logout", postLogout);

module.exports = router;
