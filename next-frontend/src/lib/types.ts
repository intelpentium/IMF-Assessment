import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth functions
export const signup = async (userData: { name: string; email: string; password: string }): Promise<User> => {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data;
};

export const signin = async (credentials: { email: string; password: string }): Promise<User> => {
  const response = await apiClient.post('/auth/signin', credentials);
  return response.data;
};

export const signout = async (): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/signout');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Posts functions
export const getPosts = async (page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
  const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: { title: string; content: string }): Promise<Post> => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const updatePost = async (id: number, postData: { title: string; content: string }): Promise<Post> => {
  const response = await apiClient.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};