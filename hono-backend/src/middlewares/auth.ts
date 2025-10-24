import { Context } from 'hono';
import { verifyToken } from '../utils/jwt';
import { userRepository } from '../repositories/user';

export const authGuard = async (c: Context, next: () => Promise<void>) => {
  try {
    // Ambil token dari cookie
    const token = c.req.cookie('token');
    
    if (!token) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'Access token required' } }, 401);
    }

    // Verifikasi token
    const payload = await verifyToken(token);
    
    if (!payload) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } }, 401);
    }

    // Dapatkan user berdasarkan payload
    const user = await userRepository.findById(Number(payload.sub));
    if (!user) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'User not found' } }, 401);
    }

    // Simpan userId ke dalam context
    c.set('userId', Number(payload.sub));
    
    await next();
  } catch (error) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication failed' } }, 401);
  }
};