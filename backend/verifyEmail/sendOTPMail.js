import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPMail = async (otp, email) => {
 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false  // ignore self-signed certificate error
    }
  });

  const info = await transporter.sendMail({
    from: `"Cartz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `<h3>Forgot your Password</h3>
           <p>Your OTP for password reset is:</p>
           <h2>${otp}</h2>`
  });

  console.log("Message sent:", info.messageId);
};