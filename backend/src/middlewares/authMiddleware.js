import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token;
  // Check for token in cookies
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  let decoded = null;
  try {
    // Verify token
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export { authUser };
