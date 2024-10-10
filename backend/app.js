import express from 'express';
import cors from 'cors';
import { db } from './db/db.js';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(cors());

// Middleware for Authentication
import authenticateUser from './middleware/authMiddleware.js';

// Load Routes
const loadRoutes = async () => {
    const routes = readdirSync('./routes');
    for (const route of routes) {
        const routeModule = await import(`./routes/${route}`); // Using dynamic import
        app.use('/api/v1', routeModule.default); // Assuming each route file has a default export
    }
};

// Server
const server = async () => {
    await loadRoutes(); // Ensure routes are loaded before starting the server
    db();
    app.listen(PORT, () => {
        console.log('Listening to port:', PORT);
    });
};

server();
