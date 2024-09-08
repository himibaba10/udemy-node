const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: req.flash("error")[0],
  });
};

const postSignup = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "This email is already registered");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({ email, password: hashedPassword });
          return newUser.save();
        })
        .then(() => {
          console.log("User created");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: req.flash("error")[0],
  });
};

const postLogin = (req, res, next) => {
  // To set cookies:
  // res.setHeader("Set-Cookie", "loggedIn=true");

  // To set session:
  // req.session.isLoggedIn = true;

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              if (err) console.log(err);
              console.log("Login successful");
              res.redirect("/");
            });
          } else {
            console.log("Incorrect password");
            res.redirect("/login");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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
