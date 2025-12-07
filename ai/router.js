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
    if (result) return result;

    // FAILOVER #1 → OpenAI
    const result2 = await runOpenAI(fullMessages);
    if (result2) return result2;

    return { reply: "Ms. PRN is currently offline… try again soon." };

  } catch (err) {
    console.error("PRN AI Router Error:", err);
    return { reply: "PRN AI unavailable right now." };
  }
}

