require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(express.static("public")); // login page UI

// API rate limiting: max 100 requests per 15 minutes per IP
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: "Too many requests" } }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/nodb", require("./src/routes/noDb"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/items", require("./src/routes/items"));
app.use("/api/admin", require("./src/routes/admin"));

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
