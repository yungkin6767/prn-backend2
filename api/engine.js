export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  // Future: run CC+ compiler inside serverless
  return res.json({ success: true, wasm: "COMING_SOON" });
}

