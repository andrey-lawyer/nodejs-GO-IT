const {
  registration,
  login,
  logOut,
  current,
  subscriptionUser,
} = require("../services/authService");

const registrationController = async (req, res) => {
  const { email, password } = req.body;
  const user = await registration(email, password);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const response = await login(email, password);
  res.json(response);
};

const logOutController = async (req, res) => {
  const { authorization = "" } = req.headers;
  await logOut(authorization);
  res.status(204).json("No content");
};

const currentController = async (req, res) => {
  const { authorization = "" } = req.headers;
  const user = await current(authorization);
  res.status(200).json(user);
};

const subscriptionController = async (req, res) => {
  const { subscription } = req.body;
  if (
    subscription !== "starter" &&
    subscription !== "pro" &&
    subscription !== "business"
  ) {
    return res.status(400).json({ error: "subscription wrong" });
  }
  const { authorization = "" } = req.headers;
  await subscriptionUser(authorization, subscription);
  res.status(200).json("success");
};

module.exports = {
  registrationController,
  logOutController,
  loginController,
  currentController,
  subscriptionController,
};
