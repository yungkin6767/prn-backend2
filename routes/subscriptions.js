import express from "express";
import db from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user's subscriptions
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await db.all("SELECT * FROM subscriptions WHERE userId = ? ORDER BY createdAt DESC", userId);
    res.json(subscriptions);
  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({ error: "Failed to get subscriptions" });
  }
});

// Create new subscription
router.post("/", async (req, res) => {
  try {
    const { plan, status = "active" } = req.body;
    const userId = req.user.id;

    if (!plan) {
      return res.status(400).json({ error: "Subscription plan required" });
    }

    const result = await db.run(
      "INSERT INTO subscriptions (userId, plan, status) VALUES (?, ?, ?)",
      [userId, plan, status]
    );

    const subscription = await db.get("SELECT * FROM subscriptions WHERE id = ?", result.lastID);
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Get specific subscription
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await db.get("SELECT * FROM subscriptions WHERE id = ?", id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Verify subscription belongs to user
    if (subscription.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(subscription);
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ error: "Failed to get subscription" });
  }
});

// Update subscription
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status } = req.body;
    const subscription = await db.get("SELECT * FROM subscriptions WHERE id = ?", id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Verify subscription belongs to user
    if (subscription.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (plan) {
      await db.run("UPDATE subscriptions SET plan = ? WHERE id = ?", [plan, id]);
    }
    if (status) {
      await db.run("UPDATE subscriptions SET status = ? WHERE id = ?", [status, id]);
    }

    const updated = await db.get("SELECT * FROM subscriptions WHERE id = ?", id);
    res.json(updated);
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

// Cancel subscription
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await db.get("SELECT * FROM subscriptions WHERE id = ?", id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Verify subscription belongs to user
    if (subscription.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update status to cancelled instead of deleting
    await db.run("UPDATE subscriptions SET status = ? WHERE id = ?", ["cancelled", id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Upgrade user subscription tier
router.post("/upgrade", async (req, res) => {
  try {
    const { tier } = req.body;
    const userId = req.user.id;

    if (!tier) {
      return res.status(400).json({ error: "Tier required" });
    }

    await db.run("UPDATE users SET subscription = ? WHERE id = ?", [tier, userId]);

    res.json({ success: true, tier });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade subscription" });
  }
});

// Get current user's subscription
router.get("/me", (req, res) => {
  try {
    res.json({ subscription: req.user.subscription });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ error: "Failed to get subscription" });
  }
});

export default router;

