const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jessyca.smith12@ethereal.email",
    pass: "9HB9a3CPWbWbX3aysM",
  },
});

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
        .then((result) => {
          transporter.sendMail({
            from: '"You are signed up successfully 👻" <nodeshop@gmail.com>', // sender address
            to: result.email, // list of receivers
            subject: "Sign Up successfull", // Subject line
            text: "You are now Signed Up!", // plain text body
            html: "<b>You are now Signed Up!</b>", // html body
          });
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
            req.session.save(async (err) => {
              if (err) console.log(err);
              console.log("Login successful");
              res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid password");
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

const getResetPassword = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: req.flash("error")[0],
  });
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
  getResetPassword,
};
