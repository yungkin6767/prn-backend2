import axios from "axios";
import { config } from "../../config/env.js";
import { msprnPersona } from "../persona/msprn.js";

// Initialize Gemini AI engine
let genAI = null;
let model = null;

export function initializeGemini(modelName = "gemini-pro") {
  const apiKey = getApiKey("OPENAI_API_KEY");
  
  if (!apiKey) {
    throw new Error("Google API key not found");
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: modelName });
  
  return model;
}

export function getGeminiModel(modelName = "gemini-pro") {
  if (!model) {
    return initializeGemini(modelName);
  }
  return model;
}

// Helper function to convert messages to Gemini format
export function convertToGeminiFormat(messages) {
  const geminiMessages = [];
  
  for (const msg of messages) {
    if (msg.role === "system") {
      // System messages are handled via systemInstruction, skip them here
      continue;
    }
    
    const role = msg.role === "user" ? "user" : "model";
    const content = msg.content || msg.text || "";
    
    if (content) {
      geminiMessages.push({
        role: role,
        parts: [{ text: content }]
      });
    }
  }
  
  return geminiMessages;
}

// Generate content using Gemini
export async function generateContent({ messages, systemInstruction, modelName = "gemini-pro" }) {
  const currentModel = getGeminiModel(modelName);
  const geminiMessages = convertToGeminiFormat(messages);
  
  const result = await currentModel.generateContent({
    contents: geminiMessages,
    systemInstruction: systemInstruction?.trim()
  });
  
  const response = await result.response;
  return {
    text: response.text(),
    response: response,
    result: result
  };
}

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
    console.error("Gemini Error:", err);
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

