import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import useragent from 'express-useragent';
import db from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import LinkController from './controllers/LinkController.js';

dotenv.config();

// Connect to MongoDB
db.connect();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(useragent.express());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public Redirect Route (Should be last)
app.get('/:shortCode', LinkController.redirectShortUrl);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
