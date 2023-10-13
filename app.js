const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileupload = require("express-fileupload");

const errorHandler = require("./middleware/errorHandler");

const authRouter = require("./routes/auth");
const farmsRouter = require("./routes/farms");
const usersRouter = require("./routes/users");
const cowsRouter = require("./routes/cows");
const statsRouter = require("./routes/stats");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());

// Registering routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/farms", farmsRouter);
app.use("/api/v1/cows", cowsRouter);
app.use("/api/v1/stats", statsRouter);

// Custom error handler
app.use(errorHandler);

module.exports = app;
