import { Hono } from 'hono';
import authRoutes from './auth';
import postsRoutes from './posts';

const routes = new Hono();

routes.route('/auth', authRoutes);
routes.route('/posts', postsRoutes);

export default routes;