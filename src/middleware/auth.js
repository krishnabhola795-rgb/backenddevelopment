const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks the JWT, loads the user, and checks token version (single session).
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Token missing" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ error: "Session expired. You logged in on another device." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// RBAC: allow only some roles.
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: you do not have permission" });
  }
  next();
};

module.exports = { auth, requireRole };
