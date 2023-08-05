const Joi = require("joi");

module.exports.userSchema = Joi.object({
  username: Joi.string().min(6).max(10).required().messages({
    "string.base": "This field must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Should be at least 6 characters",
    "string.max": "Should not exceed 10 characters",
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
      "string.base": "This field must be a string",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Include mix of: Upper/lowercase, numbers & symbols",
      "any.required": "Password is required",
    }),
});
