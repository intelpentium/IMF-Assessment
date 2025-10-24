import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/posts';
import { authGuard } from '../middlewares/auth';

const postsRoutes = new Hono();

// Schema validasi
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
});

// Routes
postsRoutes.get('/', listPosts);
postsRoutes.get('/:id{[0-9]+}', getPost);
postsRoutes.post('/', authGuard, zValidator('json', createPostSchema), createPost);
postsRoutes.put('/:id{[0-9]+}', authGuard, zValidator('json', updatePostSchema), updatePost);
postsRoutes.delete('/:id{[0-9]+}', authGuard, deletePost);

export default postsRoutes;