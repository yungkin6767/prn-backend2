import express from "express";
import auth from "../middlewares/auth.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// Ms. PRN MODEL
router.post("/", auth, async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.json({ reply: "⚠️ PRN AI Server Busy." });
  }
});

export default router;
