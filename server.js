const { default: mongoose } = require("mongoose");
const { MONGODB_URI } = require("./constants");

const runServer = (app) => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      app.listen(3000, () => {
        console.log("App is running on port 3000 and connected to Mongoose");
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = runServer;
