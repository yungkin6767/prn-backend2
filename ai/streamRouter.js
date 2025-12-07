// AI Streaming Router - Handles streaming responses from AI engines
import { runPRNAI } from "./router.js";

// Stream AI responses (Server-Sent Events)
export async function streamPRNAI(messages, res) {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // For now, get full response and stream it
    // TODO: Implement true streaming from AI engines
    const result = await runPRNAI(messages);
    
    if (result && result.reply) {
      // Stream the reply character by character or chunk by chunk
      const text = result.reply;
      const chunkSize = 10; // Characters per chunk
      
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
        // Small delay for streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Send final message with preview_code if available
      res.write(`data: ${JSON.stringify({ 
        chunk: "", 
        done: true, 
        preview_code: result.preview_code 
      })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: "No response from AI" })}\n\n`);
    }
    
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}

