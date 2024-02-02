const UserRepository = require("../repositories/userRepository");
const { APIError, STATUS_CODES } = require("../utils/appError");
const auth = require("../utils/signToken");
const sendEmail = require("../utils/sendMail");
const genSalt = require("../utils/generateSalt");
const bcrypt = require("bcryptjs");

class AuthService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignUp(user) {
    const { name, email, password, type } = user;
    try {
      const oldUser = await this.repository.FindUser(email);
      if (oldUser) {
        throw new APIError("User Already Exists.", STATUS_CODES.NOT_FOUND);
      }
      const salt = await genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const user = await this.repository.CreateUser({
        name,
        email,
        password: encryptedPassword,
        type,
      });

      if (!user) {
        throw new APIError(
          "Unable to create User",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }
      const generatedSalt = await this.repository.CreateSalt({
        userId: user._id,
        salt: salt,
      });

      if (!generatedSalt) {
        throw new APIError(
          "Unable to store salt",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async SignIn(user) {
    const { email, password } = user;
    try {
      const user = await this.repository.FindUser(email);
      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }
      const salt = await this.repository.FindSalt(user._id);
      if (!salt) {
        throw new APIError("Unable to find salt", STATUS_CODES.NOT_FOUND);
      }

      const enteredEncryptedPassword = await bcrypt.hash(password, salt.salt);
      const storedEncryptedPassword = user.password;

      if (enteredEncryptedPassword !== storedEncryptedPassword) {
        throw new APIError("Invalid Password", STATUS_CODES.NOT_FOUND);
      }

      const token = auth.signToken({ id: user._id });
      return token;
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async ForgotPassword(email) {
    try {
      const oldUser = await this.repository.FindUser(email);
      if (!oldUser) {
        throw new APIError("User Not Exists.", STATUS_CODES.NOT_FOUND);
      }
      const token = auth.signTokenForPasswordReset({ id: oldUser._id });
      const link = `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`;
      const emailSent = await sendEmail(link, oldUser.email);
      if (!emailSent) {
        throw new APIError(
          "Unable to Send Email",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async ResetPassword(user) {
    const { userId, password } = user;
    try {
      const salt = await genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const updatedUser = await this.repository.UpdateUser(
        { password: encryptedPassword },
        userId
      );
      if (!updatedUser) {
        throw new APIError(
          "Failed to update user",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const updatedSalt = await this.repository.UpdateSalt(userId, salt);
      if (!updatedSalt) {
        throw new APIError(
          "Unable to store salt",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = AuthService;
