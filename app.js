const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { getError } = require("./controllers/error");
const sequelize = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(getError);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("App is running on port 3000 and connected to sequelize");
    });
  })
  .catch((err) => {
    console.log(err);
  });
