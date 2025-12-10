import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token!" });
  }
};
