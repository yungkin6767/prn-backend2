import express from "express";
import db from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", auth, async (req, res) => {
  const { amount } = req.body;

  await db.run(`
    UPDATE users SET diamonds = diamonds + ? WHERE id = ?
  `, [amount, req.user.id]);

  res.json({ success: true });
});

router.post("/spend", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await db.get(
    "SELECT diamonds FROM users WHERE id = ?",
    req.user.id
  );

  if (user.diamonds < amount)
    return res.json({ success: false, error: "Not enough diamonds" });

  await db.run(`
    UPDATE users SET diamonds = diamonds - ? WHERE id = ?
  `, [amount, req.user.id]);

  res.json({ success: true });
});

router.get("/me", auth, async (req, res) => {
  const user = await db.get(
    "SELECT diamonds FROM users WHERE id = ?",
    req.user.id
  );

  res.json({ diamonds: user.diamonds });
});

export default router;
