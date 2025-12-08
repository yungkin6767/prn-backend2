import express from "express";
import db from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user's messages
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await db.all("SELECT * FROM messages WHERE userId = ? ORDER BY createdAt DESC", userId);
    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// Create new message
router.post("/", async (req, res) => {
  try {
    const { content, role } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Message content required" });
    }

    const result = await db.run(
      "INSERT INTO messages (userId, content, role) VALUES (?, ?, ?)",
      [userId, content, role || "user"]
    );

    const message = await db.get("SELECT * FROM messages WHERE id = ?", result.lastID);
    res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Get specific message
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await db.get("SELECT * FROM messages WHERE id = ?", id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify message belongs to user
    if (message.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(message);
  } catch (error) {
    console.error("Get message error:", error);
    res.status(500).json({ error: "Failed to get message" });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await db.get("SELECT * FROM messages WHERE id = ?", id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify message belongs to user
    if (message.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await db.run("DELETE FROM messages WHERE id = ?", id);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;

