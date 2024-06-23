var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

// import routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const inventoryRouter = require("./routes/catalog");

var app = express();

// Compress all routes
app.use(compression());

// Add helmet to the middleware chain.
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    originAgentCluster: true,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:", "blob:"],
    },
  })
);

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  validate: { xForwardedForHeader: false },
});
// Apply rate limiter to all requests
app.use(limiter);
app.set("trust proxy", 1);

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set up routes/routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/inventory", inventoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
