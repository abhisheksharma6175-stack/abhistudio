const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes by verifying JWT in cookies.
async function protect(req, res, next) {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || "salon_session"];
    if (!token) return res.status(401).json({ error: "Not authorized." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized." });
  }
}

// Restrict route to admins only.
function admin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Admin access required." });
}

module.exports = { protect, admin };
