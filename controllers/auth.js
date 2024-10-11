const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
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
    email: "",
    password: "",
    confirmPassword: "",
    validationErrors: {
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    },
  });
};

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  // If there is any error
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join("; ");

    const emailError = errors.array().some((el) => el.path === "email");
    const passwordError = errors.array().some((el) => el.path === "password");
    const confirmPasswordError = errors
      .array()
      .some((el) => el.path === "confirmPassword");

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: errorMessage,
      email,
      password,
      confirmPassword,
      validationErrors: { emailError, passwordError, confirmPasswordError },
    });
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
    email: "",
    password: "",
    validationErrors: {
      emailError: "",
      passwordError: "",
    },
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join("; ");

    const emailError = errors.array().some((el) => el.path === "email");
    const passwordError = errors.array().some((el) => el.path === "password");

    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errorMessage,
      email,
      password,
      validationErrors: {
        emailError: emailError,
        passwordError: passwordError,
      },
    });
  }

  bcrypt
    .compare(password, req.user.password)
    .then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = req.user;
        req.session.save(async (err) => {
          if (err) console.log(err);
          console.log("Login successful");
          res.redirect("/");
        });
      } else {
        console.log("Incorrect password");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: "Invalid email or password",
          email,
          password,
          validationErrors: {
            emailError: "",
            passwordError: "",
          },
        });
      }
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

const postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found with this email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        return user.save();
      })
      .then(() => {
        return transporter.sendMail({
          from: "Reset password link <nodeshop@gmail.com>", // sender address
          to: req.body.email, // list of receivers
          subject: "Reset Node Shop Password", // Subject line
          html: `
          <p>Your reset password link is below:</p>
          <a href='http:localhost:3000/reset/${token}'>Click here to reset the password</a>
          `, // html body
        });
      })
      .then(() => {
        console.log("Reset password email sent");
        return res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
};

const getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Reset token is invalid or expired");
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Reset Password",
        errorMessage: req.flash("error")[0],
        userId: user._id.toString(),
        token,
      });
    })
    .catch((err) => console.log(err));
};

const postNewPassword = (req, res, next) => {
  User.findOne({
    _id: req.body.userId,
    resetToken: req.body.token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "No user found with this ID");
        return res.redirect("/");
      }
      return bcrypt
        .hash(req.body.password, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          return user.save();
        })
        .then(() => {
          console.log("Password reset successful");
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
};
