import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const checkAuth = (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers?.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({
      message: "unauthorized",
      success: false,
    });
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    console.log('decodedToken', decodedToken)
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};

export default checkAuth;
