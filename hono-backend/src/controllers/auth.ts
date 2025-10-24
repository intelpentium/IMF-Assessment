import { Context } from 'hono';
import { signToken } from '../utils/jwt';
import { userRepository } from '../repositories/user';
import { hashPassword, verifyPassword } from '../utils/hash';

export const signup = async (c: Context) => {
  try {
    const { name, email, password } = await c.req.json();
    
    // Cek apakah user sudah ada
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return c.json({ 
        error: { 
          code: 'USER_EXISTS', 
          message: 'User with this email already exists' 
        } 
      }, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const newUser = await userRepository.create({
      name,
      email,
      passwordHash: hashedPassword,
    });

    // Buat token
    const token = await signToken({ sub: newUser.id.toString() });

    // Set cookie dengan token
    c.header('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);

    // Kembalikan user info tanpa password
    const { passwordHash, ...userWithoutPassword } = newUser;
    return c.json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ 
      error: { 
        code: 'SIGNUP_ERROR', 
        message: 'Failed to create account' 
      } 
    }, 500);
  }
};

export const signin = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    
    // Cari user berdasarkan email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return c.json({ 
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Invalid email or password' 
        } 
      }, 401);
    }

    // Verifikasi password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return c.json({ 
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Invalid email or password' 
        } 
      }, 401);
    }

    // Buat token
    const token = await signToken({ sub: user.id.toString() });

    // Set cookie dengan token
    c.header('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);

    // Kembalikan user info tanpa password
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ 
      error: { 
        code: 'SIGNIN_ERROR', 
        message: 'Failed to sign in' 
      } 
    }, 500);
  }
};

export const signout = async (c: Context) => {
  // Hapus cookie token
  c.header('Set-Cookie', 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;');
  return c.json({ message: 'Signed out successfully' });
};

export const me = async (c: Context) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ 
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'User not authenticated' 
        } 
      }, 401);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return c.json({ 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'User not found' 
        } 
      }, 404);
    }

    // Kembalikan user info tanpa password
    const { passwordHash, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  } catch (error) {
    console.error('Me error:', error);
    return c.json({ 
      error: { 
        code: 'ME_ERROR', 
        message: 'Failed to get user profile' 
      } 
    }, 500);
  }
};