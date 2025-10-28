import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../utils/jwt';
import { userRepository } from '../repositories/user';

export const authGuard: MiddlewareHandler = async (c, next) => {
  try {
    const token = getCookie(c, 'token');
    if (!token) {
      return c.json(
          { error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } },
          401
      );
    }

    const payload = await verifyToken(token);
    if (!payload?.sub) {
      return c.json(
          { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
          401
      );
    }

    const userId = Number(payload.sub);
    const user = await userRepository.findById(userId);
    if (!user) {
      return c.json(
          { error: { code: 'UNAUTHORIZED', message: 'User not found' } },
          401
      );
    }

    c.set('userId', userId);

    return next();
  } catch {
    return c.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication failed' } },
        401
    );
  }
};
