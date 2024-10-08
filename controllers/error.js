const getError = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isAuthenticated: req.session.user,
    });
};

module.exports = {
  getError,
};
