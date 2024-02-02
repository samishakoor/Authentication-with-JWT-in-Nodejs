const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");
const authorizeUser = require("../middlewares/roleAuth");
const resetPasswordAuth = require("../middlewares/resetPasswordAuth");
const validate = require("../middlewares/validation");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/authValidator");
const { CUSTOMER, OWNER, VISITOR } = require("../utils/constants");

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/forgotPassword",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.get(
  "/resetPassword/:token",
  resetPasswordAuth,
  authorizeUser([CUSTOMER, OWNER]),
  authController.resetPasswordForm
);

router.post(
  "/resetPassword/:token",
  resetPasswordAuth,
  authorizeUser([CUSTOMER, OWNER]),
  validate(resetPasswordSchema),
  authController.resetPassword
);

router
  .route("/userData")
  .get(
    authenticateUser,
    authorizeUser([CUSTOMER, OWNER]),
    userController.getUserData
  );

router
  .route("/updateUser")
  .patch(
    authenticateUser,
    authorizeUser([CUSTOMER, OWNER]),
    userController.updateUser
  );

module.exports = router;
