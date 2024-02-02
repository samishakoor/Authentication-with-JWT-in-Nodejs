const AuthService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const service = new AuthService();

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, type } = req.body;
  await service.SignUp({ name, email, password, type });
  res.status(201).json({
    status: "success",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const  token  = await service.SignIn({ email, password });
  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  await service.ForgotPassword(email);
  res.status(200).json({
    status: "success",
  });
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
  const {email} = req.user;
  res.render("resetPassword", { email: email, status: false });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const {_id,email} = req.user;
  await service.ResetPassword({ userId:_id, password });
  res.render("resetPassword", { email: email, status: true });
});
