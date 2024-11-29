import express from "express";
import cors from "cors";
import { db } from "./db/db.js";
import { readdirSync } from "fs";
import passport from "passport";
import googleAuthRoutes from "./routes/authRoutes.js";
import authenticateUser from "./middleware/authMiddleware.js";
import { PORT } from "./constants/constants.js";

import "./db/passport.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Middleware for Authentication

// Load Routes
const loadRoutes = async () => {
  const routes = readdirSync("./routes");
  for (const route of routes) {
    const routeModule = await import(`./routes/${route}`);
    app.use("/api/v1", routeModule.default);
  }
};

// // Add Google Authentication Route
app.use("/auth", googleAuthRoutes); // Google OAuth routes

// Server
db().then(async () => {
  await loadRoutes();
  app.listen(PORT, () => {
    console.log("Listening to port:", PORT);
  });
});