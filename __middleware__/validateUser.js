const { userSchema } = require("../schemas");

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // const errorMessages = error.details
    //   .map((detail) => detail.message)
    //   .join(",");

    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });

    if (!req.body.username || !req.body.password) {
      return res.status(404).json({ errors });
    } else {
      console.log("Errors: ", errors);
      return res.status(400).json({ errors });
    }
  } else {
    next();
  }
};
