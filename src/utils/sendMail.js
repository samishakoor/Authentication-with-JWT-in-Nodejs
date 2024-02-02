const nodemailer = require("nodemailer");
const logger = require("./loggers/appLogger");
const { APIError, STATUS_CODES } = require("./appError");
const { EMAIL_USER, EMAIL_PASSWORD } = require("../config");

module.exports = async function sendEmail(link, recipientEmail) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    service: "gmail",
    auth: {
      user:EMAIL_USER,
      pass:EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "noreply@gmail.com",
    to: recipientEmail,
    subject: "Password Reset",
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset it.</p>
      <a href="${link}">
        <button style="padding: 10px 20px; background-color: #007BFF; color: #ffffff; border: none; border-radius: 5px; text-decoration: none; cursor: pointer; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
          Reset Password
        </button>
      </a>
      <p>If you did not request this password reset, please ignore this email. The link is valid for a limited time.</p>
      <p>Thank you,<br>Team NodeJS</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.response}`);
    return true;
  }catch (e) {
    throw new APIError("Failed to Send Reset Password Email to User",STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};
