const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

const postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

module.exports = {
  getLogin,
  postLogin,
};
