const Joi = require("joi");

module.exports.userSchema = Joi.object({
  username: Joi.string().min(6).max(10).required().messages({
    "string.base": "Username must be a string",
    "string.min": "Username should be at least 6 characters",
    "string.max": "Username should not exceed 10 characters",
    "any.required": "Username is required",
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
      "any.required": "Password is required",
    }),
});
