// Tasks: Signup/Signin with MongoDB, bcrypt hashing, JWT, middleware get-profile, token versioning
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10); // password hashing
    const role = email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase() ? "admin" : "user";
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: "Signup successful", id: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(401).json({ error: "Wrong email or password" });

    const ok = await bcrypt.compare(password || "", user.password);
    if (!ok) return res.status(401).json({ error: "Wrong email or password" });

    user.tokenVersion += 1; // old tokens stop working = single session login
    await user.save();

    res.json({ message: "Signin successful", token: makeToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected route: middleware checks token first
router.get("/profile", auth, (req, res) => {
  res.json({ profile: req.user });
});

module.exports = router;
