import { hash as argon2Hash, verify as argon2Verify } from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  return await argon2Hash(password);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await argon2Verify(hash, password);
};