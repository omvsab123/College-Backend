import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { sendOTPEmail } from "../config/mailer.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const [exists] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({
      success: true,
      message: "User registered successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!"
      });
    }

    const user = rows[0];

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "MY_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FORGOT PASSWORD - generate and email OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInMinutes = 10;

    // remove existing reset entries for this email
    await db.execute("DELETE FROM password_resets WHERE email = ?", [email]);

    // insert new otp
    await db.execute(
      "INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
      [email, otp]
    );


    // send email
    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM password_resets WHERE email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// RESET PASSWORD using valid OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM password_resets WHERE email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashed,
      email,
    ]);

    // remove used otp
    await db.execute("DELETE FROM password_resets WHERE email = ?", [email]);

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};