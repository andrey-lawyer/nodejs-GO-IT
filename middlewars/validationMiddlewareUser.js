const Joi = require("joi");
const { toValidation } = require("../middlewars/validationMiddlewareContacts");

const userValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  });
  toValidation(schema, req, next);
  next();
};

module.exports = {
  userValidation,
};
