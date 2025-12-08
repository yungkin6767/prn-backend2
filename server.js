import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import messageRoutes from "./routes/messages.js";
import chatRoutes from "./routes/chat.js";
import walletRoutes from "./routes/wallet.js";
import projectRoutes from "./routes/projects.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/messages", messageRoutes);
app.use("/chat", chatRoutes);
app.use("/wallet", walletRoutes);
app.use("/projects", projectRoutes);

app.listen(5000, () => {
  console.log("PRN API running on http://localhost:5000");
});
