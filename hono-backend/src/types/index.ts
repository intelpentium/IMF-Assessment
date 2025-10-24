import type { Context } from 'hono';

export type Variables = {
  userId: number;
};

declare module 'hono' {
  interface ContextVariableMap extends Variables {}
}