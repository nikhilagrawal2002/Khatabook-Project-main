const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const db = require("./config/mongoose-connection");
const indexRouter = require("./routes/index-router");
const hisaabRouter = require("./routes/hisaab-router");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
    }),
    cookie: { secure: true },
  })
);

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

app.listen(3000);
