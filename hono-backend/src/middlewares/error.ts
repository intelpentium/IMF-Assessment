import type { Context } from 'hono';

export const errorHandler = (err: any, c: Context) => {
  console.error(err);

  if (err.message.includes('Validation error')) {
    return c.json({ 
      error: { 
        code: 'VALIDATION_ERROR', 
        message: err.message 
      } 
    }, 400);
  }

  if (err.message.includes('Unauthorized')) {
    return c.json({ 
      error: { 
        code: 'UNAUTHORIZED', 
        message: err.message 
      } 
    }, 401);
  }

  return c.json({ 
    error: { 
      code: 'INTERNAL_ERROR', 
      message: 'Internal server error' 
    } 
  }, 500);
};