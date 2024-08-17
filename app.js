const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
const { getError } = require("./controllers/error");
const { mongoConnect } = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Creating middleware to access the user everywhere in the project
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(getError);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("App is running on port 3000 and connected to Mongodb");
  });
});
