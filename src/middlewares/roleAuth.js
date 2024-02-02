const catchAsync = require("../utils/catchAsync");
const {APIError,STATUS_CODES} = require("../utils/appError");

module.exports = function authRole(allowedUserRole) {
  return catchAsync(async (req, res, next) => {
    if (!allowedUserRole.includes(req.user.type)) {
      return next(new APIError("User Not Allowed!", STATUS_CODES.FORBIDDEN));
    }
    next();
  });
};


