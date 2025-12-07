import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./api/chat.js";
import engineRoute from "./api/engine.js";
import voiceRoute from "./api/voice.js";
import authRoute from "./api/auth.js";
import streamRoute from "./api/stream.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);
app.use("/engine", engineRoute);
app.use("/voice", voiceRoute);
app.use("/auth", authRoute);
app.use("/stream", streamRoute);

// Export for Vercel
export default app;

// Start local server if not in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(8000, "0.0.0.0", () => {
    console.log("🚀 PRN Network API running on http://0.0.0.0:8000");
    console.log("   Accessible at: http://127.0.0.1:8000 or http://localhost:8000");
    console.log("   For Android emulator: http://10.0.2.2:8000");
  });
}
