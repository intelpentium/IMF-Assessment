import axios from 'axios';
import {getMe as getMeAPI, signin as signinAPI, signout as signoutAPI} from './api';

export const getUser = async (): Promise<{ id: number; name: string; email: string; createdAt: string } | null> => {
  try {
    const { data } = await getMeAPI();
    return data;
  } catch (error) {
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    return await signinAPI({email, password});
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error?.message || 'Sign in failed');
    }
    throw new Error('Sign in failed');
  }
};

export const logout = async () => {
  try {
    await signoutAPI();
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};