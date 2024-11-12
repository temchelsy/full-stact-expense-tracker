import express from 'express';
import cors from 'cors';
import { db } from './db/db.js';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import passport from 'passport';
import './db/passport.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(passport.initialize()); 

// Middleware for Authentication
import authenticateUser from './middleware/authMiddleware.js';

// Load Routes
const loadRoutes = async () => {
    const routes = readdirSync('./routes');
    for (const route of routes) {
        const routeModule = await import(`./routes/${route}`);
        app.use('/api/v1', routeModule.default); 
    }
};

// Add Google Authentication Route
import googleAuthRoutes from './routes/authRoutes.js'; 
app.use('/auth', googleAuthRoutes); // Google OAuth routes

// Server
const server = async () => {
    await loadRoutes(); 
    db();
    app.listen(PORT, () => {
        console.log('Listening to port:', PORT);
    });
};

server();
