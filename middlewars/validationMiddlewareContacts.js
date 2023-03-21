const Joi = require("joi");
const { ValidationError } = require("../helpers/errors");

const toValidation = (schema, req, next) => {
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    next(
      new ValidationError(
        JSON.stringify(validationResult.error.details[0].message)
      )
    );
  }
};

const addContactValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    phone: Joi.string().min(3).max(30).required(),
    favorite: Joi.boolean(),
  });
  toValidation(schema, req, next);
  next();
};

const updateContactValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().min(3).max(30),
    favorite: Joi.boolean(),
  });
  toValidation(schema, req, next);
  next();
};

const patchFavoriteValidation = (req, res, next) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });
  toValidation(schema, req, next);
  next();
};

module.exports = {
  addContactValidation,
  updateContactValidation,
  patchFavoriteValidation,
  toValidation,
};
