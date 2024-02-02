const Joi = require("joi");

const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const signupSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
  type: Joi.string().valid('visitor', 'owner', 'customer').required()
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};

