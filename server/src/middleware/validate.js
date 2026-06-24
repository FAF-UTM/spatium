// Runs express-validator chains and converts any failures into a 400 ApiError.
const { validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return next(new ApiError(400, 'Validation failed', details));
}

module.exports = validate;
