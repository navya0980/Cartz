import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const verifyEmail = async (token, email) => {
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
    from: `"Cartz Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    text: `Your verification token is: ${token}`,
    html: `<h3>Email Verification</h3>
           <p>Your verification link is:</p>
           <h2>http://localhost:5173/verify/${token}</h2>`
  });

  console.log("Message sent:", info.messageId);
};