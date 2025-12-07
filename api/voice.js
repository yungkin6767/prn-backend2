import axios from "axios";
import { config } from "../config/env.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  try {
    const audio = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        input: text,
        model: "gpt-4o-mini-tts",
        voice: "alloy"
      },
      {
        responseType: "arraybuffer",
        headers: { Authorization: `Bearer ${config.OPENAI_API_KEY}` }
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(Buffer.from(audio.data));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

