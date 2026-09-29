import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Resolve the .env file relative to the project root (works in dev and production)
const envPath = path.resolve(__dirname, '../.env');
const prodEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : prodEnvPath });

const app = express();
const port = process.env.PORT || 5000;
const configuredOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins?.length
  ? configuredOrigins
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins?.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dynamic route loading with error handling
try {
  const clientRoutes = require('../routes/client.routes').default;
  const projectRoutes = require('../routes/project.routes').default;
  const paymentRoutes = require('../routes/payment.routes').default;
  const authRoutes = require('../routes/auth.routes').default;
  const aiRoutes = require('../routes/ai.routes').default;
  
  app.use('/api/auth', authRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/ai', aiRoutes);
} catch (error) {
  console.warn('Routes not yet fully configured:', error);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`✓ Server is running on port ${port}`);
  console.log(`✓ Health check: http://localhost:${port}/health`);
});

