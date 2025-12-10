// // import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// import e from "express";
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });


// export const sendOTPEmail = async (to, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Your OTP for password reset",
//     text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes. If you didn't request this, ignore this email.`,
//   };

//   return transporter.sendMail(mailOptions);
// };

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (to, otp) => {
  try {
    await resend.emails.send({
      from: "PMD College <onboarding@resend.dev>",
      to,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <br/>
          <p>If you didn’t request this, simply ignore this mail.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email sending failed");
  }
};
