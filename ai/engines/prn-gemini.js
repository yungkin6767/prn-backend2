import axios from "axios";
import { config } from "../../config/env.js";
import { msprnPersona } from "../persona/msprn.js";

// Run Gemini with messages array (simplified interface)
export async function runGemini(messages) {
  try {
    if (!config.GOOGLE_API_KEY) {
      console.error("Google API key not found");
      return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GOOGLE_API_KEY}`;

    // Filter out system messages and convert to Gemini format
    // System messages are handled via systemInstruction in the API
    const contents = messages
      .filter(m => m.role !== "system")
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text || "" }]
      }));

    // Extract system instruction from messages
    const systemMessage = messages.find(m => m.role === "system");
    const systemInstruction = systemMessage?.content || msprnPersona;

    const res = await axios.post(url, {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      }
    });

    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    // Extract CC+ code if present
    const preview_code = extractCCPlusCode(text);

    return { 
      reply: text,
      preview_code
    };

  } catch (err) {
    // Check if it's a 429 (quota exceeded) error
    if (err.response?.status === 429) {
      console.warn("Gemini quota exceeded, failing over to OpenAI...");
    } else {
      console.error("Gemini Error:", err.response?.data || err.message);
    }
    return null; // fallback will trigger
  }
}

// Extract CC+ code from response text
export function extractCCPlusCode(text) {
  // Try fenced code blocks first
  const ccplusCodeMatch = text.match(/```cc\+([\s\S]*?)```/);
  if (ccplusCodeMatch) {
    return ccplusCodeMatch[1].trim();
  }
  
  // Fallback to @ccplus command format
  const ccplusMatch = text.match(/@ccplus\s*([\s\S]*?)@end/);
  if (ccplusMatch) {
    return ccplusMatch[1].trim();
  }
  
  // Also check for @preview command
  const previewMatch = text.match(/@preview\s*([\s\S]*?)@end/);
  if (previewMatch) {
    return previewMatch[1].trim();
  }
  
  return null;
}

