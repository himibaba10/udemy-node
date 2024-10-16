const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const Token = require("csrf");
const token = new Token();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorRoutes = require("./routes/error");

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
app.use(flash());

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  token.secret((err, secret) => {
    if (err) {
      throw new Error(err);
    }

    const csrfToken = token.create(secret);

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = csrfToken;
    next();
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use(getError);

app.use((err, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => {
      console.log("App is running on port 3000 and connected to Mongoose");
    });
  })
  .catch((err) => {
    throw new Error(err);
  });
