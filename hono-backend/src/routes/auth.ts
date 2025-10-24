import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { signup, signin, signout, me } from '../controllers/auth';

const authRoutes = new Hono();

// Schema validasi
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signinSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

// Routes
authRoutes.post('/signup', zValidator('json', signupSchema), signup);
authRoutes.post('/signin', zValidator('json', signinSchema), signin);
authRoutes.post('/signout', signout);
authRoutes.get('/me', me);

export default authRoutes;