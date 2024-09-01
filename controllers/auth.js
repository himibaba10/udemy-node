const getLogin = (req, res, next) => {
  res.send("<h1>Hello from the admin route!</h1>");
};

module.exports = {
  getLogin,
};
