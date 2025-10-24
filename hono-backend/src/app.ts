import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { errorHandler } from './middlewares/error';
import routes from './routes';

const app = new Hono();

// Global middlewares
app.use(logger());
app.use(secureHeaders());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Register routes
app.route('/api', routes);

// Error handler
app.onError(errorHandler);

export default app;