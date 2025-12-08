import { msprnPersona } from "./persona/msprn.js";
import { runGemini } from "./engines/prn-gemini.js";
import { runOpenAI } from "./engines/prn-openai.js";
// add more engines later (Groq, Llama, etc)

export async function runPRNAI(messages) {
  const fullMessages = [
    { role: "system", content: msprnPersona },
    ...messages,
  ];

  try {
    // PRIMARY ENGINE → GEMINI
    const result = await runGemini(fullMessages);
    if (result) {
      console.log("✅ Gemini response successful");
      return result;
    }

    // FAILOVER #1 → OpenAI
    console.log("⚠️ Gemini failed, attempting OpenAI failover...");
    const result2 = await runOpenAI(fullMessages);
    if (result2) {
      console.log("✅ OpenAI failover successful");
      return result2;
    }

    console.error("❌ All AI engines failed");
    return { 
      reply: "Ms. PRN is currently offline. Both Gemini and OpenAI failed. Please check your API keys in the .env file.",
      error: "all_engines_failed"
    };

  } catch (err) {
    console.error("PRN AI Router Error:", err);
    return { reply: "PRN AI unavailable right now." };
  }
}

