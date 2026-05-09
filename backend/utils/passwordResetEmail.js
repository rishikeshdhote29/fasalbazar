const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const sendEmail = async (to, resetToken) => {
  try {
    // Create a transport object
    const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
	    port: 587,
	    secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Create a message to send
    const message = {
      from: process.env.GMAIL_USER,
      to,
      subject: "Password Reset",
      html: `
        <p>You are receiving this email because you (or someone else) requested a password reset.</p>
        <p>Please click on the following link or paste it into your browser to complete the process:</p>
        <p><a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    // Send the email
    const info = await transport.sendMail(message);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
module.exports = sendEmail;