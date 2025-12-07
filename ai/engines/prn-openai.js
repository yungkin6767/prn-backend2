import axios from "axios";
import { config } from "../../config/env.js";
import { extractCCPlusCode } from "./prn-gemini.js";

// Run OpenAI with messages array (simplified interface)
export async function runOpenAI(messages) {
  try {
    if (!config.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found");
      return null;
    }

    // OpenAI accepts system messages in the messages array, so we can pass them directly
    // Convert messages to OpenAI format (role: system/user/assistant, content: text)
    const openAIMessages = messages.map((m) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.content || m.text || ""
    }));

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // Fixed model name (gpt-4.1-mini doesn't exist)
        messages: openAIMessages,
      },
      {
        headers: { Authorization: `Bearer ${config.OPENAI_API_KEY}` }
      }
    );

    const text = res.data.choices?.[0]?.message?.content;
    if (!text) return null;

    // Extract CC+ code if present
    const preview_code = extractCCPlusCode(text);

    return { 
      reply: text,
      preview_code
    };

  } catch (err) {
    console.error("OpenAI Error:", err);
    return null; // fallback will trigger
  }
}

