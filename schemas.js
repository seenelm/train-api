const Joi = require("joi");

module.exports.userSchema = Joi.object({
  name: Joi.string().max(35).required().messages({
    "string.base": "Name must be a string",
    "string.max": "Name should not exceed 35 characters",
    "string.empty": "Name is required",
  }),
  username: Joi.string().min(6).max(10).required().messages({
    "string.base": "Username must be a string",
    "string.min": "Username should be at least 6 characters",
    "string.max": "Username should not exceed 10 characters",
    "string.empty": "Username is required",
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$"
      )
    )
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.pattern.base":
        "Password must be a mix of upper & lower case letters, numbers & symbols",
      "string.empty": "Password is required",
    }),
});
