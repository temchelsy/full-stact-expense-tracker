import { config } from "dotenv";

config();

const MONGO_URL = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;

// JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// FE
const FRONT_END_URL =
  process.env.FRONTEND_URL || "https://full-stact-expense-tracker.vercel.app";

export {
  MONGO_URL,
  PORT,

  // JWT
  JWT_SECRET,
  JWT_EXPIRES_IN,

  // FE
  FRONT_END_URL,
};
