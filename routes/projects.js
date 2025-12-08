import express from "express";
import db from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/save", auth, async (req, res) => {
  const { name, code } = req.body;

  await db.run(`
    INSERT INTO projects (user_id, name, code, created_at, updated_at)
    VALUES (?, ?, ?, datetime('now'), datetime('now'))
  `, [req.user.id, name, code]);

  res.json({ success: true });
});

router.get("/list", auth, async (req, res) => {
  const list = await db.all(
    "SELECT * FROM projects WHERE user_id = ?",
    req.user.id
  );

  res.json(list);
});

router.post("/load", auth, async (req, res) => {
  const { id } = req.body;

  const project = await db.get(
    "SELECT * FROM projects WHERE id = ? AND user_id = ?",
    [id, req.user.id]
  );

  res.json(project || {});
});

export default router;
