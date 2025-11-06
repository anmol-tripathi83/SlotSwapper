import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import swapRoutes from './routes/swaps';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Log all requests
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);

// Basic route
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    message: 'SlotSwapper API is running!',
    environment: process.env.NODE_ENV 
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});