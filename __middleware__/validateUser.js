const { userSchema } = require("../schemas");

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });

    return res.status(400).json({ errors });

    // if (!req.body.username || !req.body.password || !req.body.name) {
    //   console.log("Errors: ", errors);
    //   return res.status(404).json({ errors });
    // } else {
    //   console.log("Errors: ", errors);
    //   return res.status(400).json({ errors });
    // }
  } else {
    next();
  }
};
