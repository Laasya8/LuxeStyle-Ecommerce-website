import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { clerkMiddleware } from '@clerk/express';

import { connectDB, isDbConnected } from './config/db.js';
import { isClerkConfigured } from './config/clerk.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import webhookRoutes from './routes/webhookRoutes.js';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(compression());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Clerk webhook needs the raw body for signature verification, so it is
// mounted BEFORE express.json() and excluded from the global JSON parser.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Only wire up Clerk's request-time middleware once real keys are present —
// with placeholder keys it throws on every request instead of just the
// auth-gated ones, which would break public routes like /api/health.
if (isClerkConfigured) {
  app.use(clerkMiddleware());
}

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LuxeStyle API is running',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: isDbConnected() ? 'connected' : 'not configured',
      clerk: isClerkConfigured ? 'configured' : 'not configured',
      cloudinary: isCloudinaryConfigured ? 'configured' : 'not configured',
    },
  });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] LuxeStyle API listening on http://localhost:${PORT}`);
});
