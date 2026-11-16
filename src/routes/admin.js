// Task: RBAC (Role Based Access Control) - only admin can use these routes
const express = require("express");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(auth, requireRole("admin"));

router.get("/users", async (req, res) => {
  res.json(await User.find().select("-password"));
});

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) return res.status(400).json({ error: "role must be user or admin" });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

module.exports = router;
