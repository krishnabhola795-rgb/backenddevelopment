// Task: Signup & Login WITHOUT database (data is kept in memory, lost on restart)
const express = require("express");
const router = express.Router();

const users = []; // { email, password }

router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: "User already exists" });
  users.push({ email, password });
  res.status(201).json({ message: "Signup done (no database)" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Wrong email or password" });
  res.json({ message: "Login done (no database)" });
});

module.exports = router;
