const multer = require("multer");
const path = require("path");
const { uuid } = require("uuidv4");

const FILE_DIR_AVATARS = path.resolve("./tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR_AVATARS);
  },
  filename: (req, file, cb) => {
    // const [, extension] = file.originalname.split(".");
    // cb(null, `${uuid()}.${extension}`);
    cb(null, `${uuid()}-${file.originalname}`);
  },
});

const fileMiddleware = multer({ storage });
module.exports = fileMiddleware;
