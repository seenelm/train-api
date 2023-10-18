const Errors = require("../utils/errors");

function handleInternalServerError(error, res) {
  res.status(error.statusCode);
}

function handleConflictError(error, res) {}

function handleResourceNotFoundError(error, res) {}

module.exports = (error, req, res, next) => {};
