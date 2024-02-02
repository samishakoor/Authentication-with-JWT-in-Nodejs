const { PORT, DB_URI } = require("./src/config");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./src/utils/loggers/appLogger");

process.on("uncaughtException", () => {
  logger.error("Uncaught Exception Occur! Shutting down...");
  process.exit(1);
});

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => logger.info("DB connection successful!"))
  .catch((err) => {
    logger.error(`MongoDB Connection ${err}`);
  });

const port = PORT || 3000;
app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

process.on("unhandledRejection", () => {
  logger.error("Unhandled Rejection Occur! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
