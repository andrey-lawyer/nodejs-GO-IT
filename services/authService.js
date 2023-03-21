const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");

const path = require("path");
const PUBLIC_DIR = path.join(__dirname, "../public/");
const AVATARS = "avatars";

const { User } = require("../db/userModel");

const {
  NotAuthorizedError,
  ConflictAuthorizedError,
  FileError,
} = require("../helpers/errors");

const registration = async (email, password) => {
  const result = await User.findOne({ email });
  if (result) {
    throw new ConflictAuthorizedError("Email in use");
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    email,
    password: hashedPassword,
    avatarURL: gravatar.url(email, { protocol: "http", s: "100" }),
  });
  return await user.save();
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotAuthorizedError(`No user with email '${email}' found`);
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new NotAuthorizedError(`Password is wrong`);
  }
  const payload = {
    _id: user._id,
    subscription: user.subscription,
  };
  const SECRET_JVT = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(payload, SECRET_JVT);
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
};

const logOut = async (authorization) => {
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new NotAuthorizedError(`Bad credentials`);
  }
  const SECRET_JVT = process.env.JWT_SECRET_KEY;
  const payload = jwt.verify(token, SECRET_JVT);
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    throw new NotAuthorizedError(`Not authorized`);
  }
  await User.findByIdAndUpdate(user._id, { token: null });
};

const current = async (authorization) => {
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new NotAuthorizedError(`Bad credentials`);
  }
  const SECRET_JVT = process.env.JWT_SECRET_KEY;
  const payload = jwt.verify(token, SECRET_JVT);
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    throw new NotAuthorizedError(`Not authorized`);
  }
  const { email, subscription } = user;
  return { email, subscription };
};

const subscriptionUser = async (authorization, subscription) => {
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new NotAuthorizedError(`Bad credentials`);
  }
  const SECRET_JVT = process.env.JWT_SECRET_KEY;
  const payload = jwt.verify(token, SECRET_JVT);
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    throw new NotAuthorizedError(`Not authorized`);
  }

  await User.findByIdAndUpdate(user._id, { subscription });
};

const avatarUser = async (req) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new NotAuthorizedError(`Bad credentials`);
  }
  if (!req.file) throw new FileError("File not found");

  const SECRET_JVT = process.env.JWT_SECRET_KEY;
  const payload = jwt.verify(token, SECRET_JVT);
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    throw new NotAuthorizedError(`Not authorized`);
  }
  // const newAvatarUrl = req.file.destination + "\\" + req.file.filename;
  // await User.findByIdAndUpdate(user._id, { avatarURL: newAvatarUrl });
  // return newAvatarUrl;

  const avatarURL = path.join(AVATARS, `${user._id}${req.file.originalname}`);
  const fullAvatarURL = path.join(PUBLIC_DIR, avatarURL);
  jimp.read(req.file.path, (err, image) => {
    if (err) throw err;
    image.resize(250, 250).write(fullAvatarURL);
  });
  await User.findByIdAndUpdate(user._id, { avatarURL: fullAvatarURL });
  return fullAvatarURL;
};

module.exports = {
  registration,
  login,
  logOut,
  current,
  subscriptionUser,
  avatarUser,
};
