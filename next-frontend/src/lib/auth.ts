import axios from 'axios';
import { signin as signinAPI, signout as signoutAPI, getMe as getMeAPI } from './api';

// Get user profile from API
export const getUser = async (): Promise<{ id: number; name: string; email: string; createdAt: string } | null> => {
  try {
    const user = await getMeAPI();
    return user;
  } catch (error) {
    // If the request fails, user is not authenticated
    return null;
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    const response = await signinAPI({ email, password });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error?.message || 'Sign in failed');
    }
    throw new Error('Sign in failed');
  }
};

// Sign out function
export const logout = async () => {
  try {
    await signoutAPI();
  } catch (error) {
    console.error('Sign out failed:', error);
    // Even if sign out fails, we clear local state
  }
};