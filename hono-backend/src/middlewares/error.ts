import { Context, HonoError } from 'hono';

export const errorHandler = (err: HonoError, c: Context) => {
  console.error(err);
  
  // Jika error berasal dari validator
  if (err.message.includes('Validation error')) {
    return c.json({ 
      error: { 
        code: 'VALIDATION_ERROR', 
        message: err.message 
      } 
    }, 400);
  }

  // Jika error adalah Unauthorized
  if (err.message.includes('Unauthorized')) {
    return c.json({ 
      error: { 
        code: 'UNAUTHORIZED', 
        message: err.message 
      } 
    }, 401);
  }

  // Error server lainnya
  return c.json({ 
    error: { 
      code: 'INTERNAL_ERROR', 
      message: 'Internal server error' 
    } 
  }, 500);
};