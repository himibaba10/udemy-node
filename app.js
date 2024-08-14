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
const Product = require("./models/product");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(getError);

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

// Relations between the models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

sequelize
  // .sync({ force: true }) //for development
  .sync() //for production
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Ferdous", email: "himibaba10@gmail.com" });
    }
    return user;
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("App is running on port 3000 and connected to sequelize");
    });
  })
  .catch((err) => {
    console.log(err);
  });
