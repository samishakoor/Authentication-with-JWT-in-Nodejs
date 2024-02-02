const UserService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");

const service = new UserService();

exports.getUserData = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const data = await service.UpdateUser({ name, userId: _id });
  res.status(200).json({
    status: "success",
    data: data,
  });
});
