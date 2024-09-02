const getLogin = (req, res, next) => {
  const isLoggedIn = Boolean(req.get("Cookie").split("=")[1]);
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
