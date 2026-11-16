// Task: MongoDB CRUD (Create, Read, Update, Delete)
const express = require("express");
const Item = require("../models/Item");
const { auth } = require("../middleware/auth");

const router = express.Router();
router.use(auth);

// Create
router.post("/", async (req, res) => {
  try {
    const item = await Item.create({ ...req.body, owner: req.user._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all (admin sees all, user sees own)
router.get("/", async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
  res.json(await Item.find(filter));
});

// Read one
router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id).catch(() => null);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin" && String(item.owner) !== String(req.user._id)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json(item);
});

// Update
router.put("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id).catch(() => null);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin" && String(item.owner) !== String(req.user._id)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  item.title = req.body.title ?? item.title;
  item.description = req.body.description ?? item.description;
  await item.save();
  res.json(item);
});

// Delete
router.delete("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id).catch(() => null);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin" && String(item.owner) !== String(req.user._id)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  await item.deleteOne();
  res.json({ message: "Deleted" });
});

module.exports = router;
