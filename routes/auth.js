import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed]
    );

    res.json({ success: true });
  } catch {
    res.json({ success: false, error: "Email exists." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.get(
    "SELECT * FROM users WHERE email = ?",
    email
  );

  if (!user) return res.json({ success: false });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.json({ success: false });

  const token = jwt.sign(
    { id: user.id, email: user.email, subscription: user.subscription },
    "PRN_SECRET",
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
});

export default router;
