const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Token = require("csrf");
const token = new Token();

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
  if (req.session.user) {
    User.findById(req.session.user._id).then((user) => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  token.secret((err, secret) => {
    if (err) console.log(err);

    const csrfToken = token.create(secret);

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = csrfToken;
    next();
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(getError);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => {
      console.log("App is running on port 3000 and connected to Mongoose");
    });
  })
  .catch((err) => {
    console.log(err);
  });
