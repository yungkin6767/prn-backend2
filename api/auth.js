import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/env.js";

let users = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, email, password } = req.body;

  if (action === "register") {
    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });
    return res.json({ success: true });
  }

  if (action === "login") {
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ email }, config.JWT_SECRET);
    return res.json({ token });
  }

  return res.status(400).json({ error: "Invalid auth action" });
}

