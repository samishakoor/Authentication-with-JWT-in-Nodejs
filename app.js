const apiRouter = require("./src/routes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const { APIError, STATUS_CODES } = require("./src/utils/appError");
const httpLogger = require("./src/utils/loggers/httpLogger");
const { errorHandler } = require("./src/utils/errorHandler");
require("express-validator");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(helmet());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV !== "prod") {
  app.use(morgan("dev"));
} else {
  app.use(httpLogger);
}


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api/v1", limiter);

app.use(mongoSanitize());
app.use(xss());

//routing
app.use("/api/v1", apiRouter);

app.all("*", (req, res, next) => {
  const err = new APIError(
    `Can't find ${req.originalUrl} on the server!`,
    STATUS_CODES.NOT_FOUND
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
