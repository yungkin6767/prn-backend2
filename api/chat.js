import { runPRNAI } from "../ai/router.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const result = await runPRNAI(messages);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      error: "PRN AI Error",
      details: err.message
    });
  }
}

