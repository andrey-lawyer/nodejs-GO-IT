const express = require("express");
const router = new express.Router();

const { asyncWrapper } = require("../../helpers/apiHelper");

const {
  registrationController,
  loginController,
  logOutController,
  currentController,
  subscriptionController,
} = require("../../controllers/authController");
const { userValidation } = require("../../middlewars/validationMiddlewareUser");
const { fileController } = require("../../controllers/fileController");
const fileMiddleware = require("../../middlewars/fileMiddleware");

router.post("/signup", userValidation, asyncWrapper(registrationController));

router.post("/login", userValidation, asyncWrapper(loginController));

router.post("/logout", asyncWrapper(logOutController));

router.get("/current", asyncWrapper(currentController));

router.patch("/", asyncWrapper(subscriptionController));

router.patch(
  "/avatars",
  fileMiddleware.single("avatar"),
  asyncWrapper(fileController)
);

module.exports = { authRouter: router };
