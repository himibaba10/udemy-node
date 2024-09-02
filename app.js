const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const { getError } = require("./controllers/error");
const User = require("./models/user");
const { default: mongoose } = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://himibaba10:PDSc0wmxY1wiVn65@cluster0.jtbd7.mongodb.net/node-complete?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const store = new MongoDBStore({
  uri: MONGODB_URI,
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  User.findById("66d1a20cda701462bae81c4f")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(getError);

mongoose.connect(MONGODB_URI).then((result) => {
  User.findOne().then((user) => {
    if (!user) {
      const newUser = new User({
        name: "Ferdous Ahmed",
        email: "himibaba10@gmail.com",
        cart: { items: [] },
      });
      return newUser.save();
    }
  });
  app.listen(3000, () => {
    console.log("App is running on port 3000 and connected to Mongoose");
  });
});
