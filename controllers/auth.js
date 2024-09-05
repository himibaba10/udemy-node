const User = require("../models/user");

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postSignup = (req, res, next) => {};

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  // To set cookies:
  // res.setHeader("Set-Cookie", "loggedIn=true");

  // To set session:
  // req.session.isLoggedIn = true;

  User.findById("66d1a20cda701462bae81c4f")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
};
