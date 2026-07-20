const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create JWT token and attach it to a cookie.
function createToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  return token;
}

// Register a new user.
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone, address });
    const token = createToken(user._id);
    res.cookie(process.env.COOKIE_NAME || "salon_session", token, { httpOnly: true, secure: process.env.COOKIE_SECURE === "true", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

// Login user and set cookie.
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = createToken(user._id);
    res.cookie(process.env.COOKIE_NAME || "salon_session", token, { httpOnly: true, secure: process.env.COOKIE_SECURE === "true", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

// Logout user by clearing cookie.
exports.logout = async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "salon_session");
  res.json({ success: true });
};

// Get logged in user profile.
exports.me = async (req, res) => {
  res.json({ user: req.user });
};
