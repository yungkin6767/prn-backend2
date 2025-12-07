import dotenv from "dotenv";

dotenv.config();

export const config = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || "PRN_SECRET",
};

