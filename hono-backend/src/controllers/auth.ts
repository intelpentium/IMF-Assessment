import { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { signToken } from '../utils/jwt';
import { userRepository } from '../repositories/user';
import { hashPassword, verifyPassword } from '../utils/hash';

function setAuthCookie(c: Context, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  setCookie(c, 'token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export const signup = async (c: Context) => {
  try {
    const { name, email, password } = await c.req.json();

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return c.json(
          { error: { code: 'USER_EXISTS', message: 'User with this email already exists' } },
          409
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ name, email, passwordHash });

    const token = await signToken({ sub: user.id.toString() });
    setAuthCookie(c, token);

    const { passwordHash: _ignored, ...safe } = user;
    return c.json(safe);
  } catch (e) {
    console.error('Signup error:', e);
    return c.json(
        { error: { code: 'SIGNUP_ERROR', message: 'Failed to create account' } },
        500
    );
  }
};

export const signin = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return c.json(
          { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
          401
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return c.json(
          { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
          401
      );
    }

    const token = await signToken({ sub: user.id.toString() });
    setAuthCookie(c, token);

    const { passwordHash: _ignored, ...safe } = user;
    return c.json(safe);
  } catch (e) {
    console.error('Signin error:', e);
    return c.json(
        { error: { code: 'SIGNIN_ERROR', message: 'Failed to sign in' } },
        500
    );
  }
};

export const signout = async (c: Context) => {
  deleteCookie(c, 'token', { path: '/' });
  return c.json({ message: 'Signed out successfully' });
};

export const me = async (c: Context) => {
  try {
    const userId = c.get('userId') as number | undefined;
    if (!userId) {
      return c.json(
          { error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } },
          401
      );
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return c.json(
          { error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
          404
      );
    }

    const { passwordHash: _ignored, ...safe } = user;
    return c.json(safe);
  } catch (e) {
    console.error('Me error:', e);
    return c.json(
        { error: { code: 'ME_ERROR', message: 'Failed to get user profile' } },
        500
    );
  }
};
