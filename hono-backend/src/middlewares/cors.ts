
import type { MiddlewareHandler, Context, Next } from 'hono';

const DEFAULT_ALLOWED = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
]);

export const simpleCors = (extraAllowed: string[] = []): MiddlewareHandler => {
    const allowed = new Set(DEFAULT_ALLOWED);
    const fromEnv = (process.env.CORS_ORIGIN || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    [...fromEnv, ...extraAllowed].forEach(o => allowed.add(o));

    return async (c: Context, next: Next): Promise<void> => {
        const reqOrigin = c.req.header('Origin') ?? '';
        const allowOrigin = allowed.has(reqOrigin) ? reqOrigin : '';

        if (allowOrigin) {
            c.header('Access-Control-Allow-Origin', allowOrigin);
            c.header('Vary', 'Origin');
            c.header('Access-Control-Allow-Credentials', 'true');
            c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            c.header('Access-Control-Allow-Headers', 'Content-Type, Cookie');
            c.header('Access-Control-Expose-Headers', '*');
        }

        if (c.req.method === 'OPTIONS') {
            c.status(204);
            return;
        }

        await next();
    };
};
