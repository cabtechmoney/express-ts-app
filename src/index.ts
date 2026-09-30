import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(__dirname, '../.env');
const prodEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : prodEnvPath });

const app = express();
const port = process.env.PORT || 5000;

const configuredOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins?.length
  ? configuredOrigins
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'https://calebcrmproject1.vercel.app'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PROPER CORS
app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'API running - use /api/auth, /api/clients etc' });
});

app.get('/api', (_req, res) => {
  res.json({ success: true, endpoints: ['/api/auth', '/api/clients', '/api/projects', '/api/payments', '/api/ai'] });
});

// Import routes directly - no try/catch hide error
import authRoutes from '../routes/auth.routes';
import clientRoutes from '../routes/client.routes';
import projectRoutes from '../routes/project.routes';
import paymentRoutes from '../routes/payment.routes';
import aiRoutes from '../routes/ai.routes';

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({ status: 'error', message: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`✓ Server is running on port ${port}`);
});