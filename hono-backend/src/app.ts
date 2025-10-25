import 'dotenv/config';

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { errorHandler } from './middlewares/error';
import routes from './routes';
import { simpleCors } from './middlewares/cors';

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.route('/api', routes);

app.use('*', simpleCors());
app.onError(errorHandler);

export default app;