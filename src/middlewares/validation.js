const catchAsync = require("../utils/catchAsync");
const { APIError, STATUS_CODES } = require("../utils/appError");

module.exports = function validate(schema) {
  return catchAsync(async (req, res, next) => {
    const { error } = await schema.validate(req.body,{ abortEarly: false });
    if (error) {
      const { details } = error; 
      const message = details.map(i => i.message).join(',')
      return next(new APIError(message, STATUS_CODES.BAD_REQUEST));
    } else {
      next();
    }
  });
};
