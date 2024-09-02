const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

const postLogin = (req, res, next) => {
  // To set cookies:
  // res.setHeader("Set-Cookie", "loggedIn=true");

  // To set session:
  req.session.isLoggedIn = true;

  res.redirect("/");
};

module.exports = {
  getLogin,
  postLogin,
};
