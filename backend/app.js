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
        const routeModule = await import(`./routes/${route}`);
        app.use('/api/v1', routeModule.default); 
    }
};

// Server
const server = async () => {
    await loadRoutes(); 
    db();
    app.listen(PORT, () => {
        console.log('Listening to port:', PORT);
    });
};

server();
