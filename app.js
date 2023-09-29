const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const errorHandler = require("./middleware/errorHandler");

const indexRouter = require("./routes/index");
const farmsRouter = require("./routes/farms");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Custom error handler
app.use(errorHandler);

// Registering routers
app.use("/", indexRouter);
app.use("/api/v1/farms", farmsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app;
