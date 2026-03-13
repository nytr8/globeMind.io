import jwt from "jsonwebtoken";
import User from "../models/User.js";
import userModel from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await userModel.create({
      username,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie("token", token);
      res.status(201).json({
        message: "user registered succesfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("-password");

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie("token", token);
      res.status(200).json({
        message: "logged in succesfully",
        user,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/user
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    res.status(200).json({
      message: "user fetched succesfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login, getUser };
