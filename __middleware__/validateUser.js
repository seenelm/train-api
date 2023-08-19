const { userSchema } = require("../schemas");

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });

    return res.status(400).json({ errors });
  } else {
    next();
  }
};
