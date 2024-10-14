const getError = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.user,
  });
};

const getServerError = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "/500",
    isAuthenticated: req.session.user,
  });
};

module.exports = {
  getError,
  getServerError,
};
