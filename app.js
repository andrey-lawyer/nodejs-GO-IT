const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();

const { contactsRouter } = require("./routes/api/contactsRouter");
const { errorHandler } = require("./helpers/apiHelper");
const { authRouter } = require("./routes/api/authRouter");

const FILE_DIR_AVATARS = path.resolve("./public/avatars");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

// static show files
app.use("/api", express.static(FILE_DIR_AVATARS));
// static show files

app.use(errorHandler);

module.exports = app;
