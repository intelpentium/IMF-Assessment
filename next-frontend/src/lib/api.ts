import api from './http';

/** ===== TYPES ===== */
export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/** ===== AUTH ===== */
export function signup(body: { name: string; email: string; password: string }) {
  return api.post<User>('/auth/signup', body);
}

export function signin(body: { email: string; password: string }) {
  return api.post<User>('/auth/signin', body);
}

export function signout() {
  return api.post<{ message: string }>('/auth/signout');
}

export function getMe() {
  return api.get<User>('/auth/me');
}

/** ===== POSTS ===== */
export function getPosts(page = 1, limit = 10) {
  return api.get<PaginatedResponse<Post>>(`/posts?page=${page}&limit=${limit}`);
}

export async function getPost(id: number) {
  const res = await api.get<any>(`/posts/${id}`);
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as { data: Post }).data;
  }
  return res as Post;
}

export function createPost(body: { title: string; content: string }) {
  return api.post<Post>('/posts', body);
}

export function updatePost(id: number, body: { title: string; content: string }) {
  return api.put<Post>(`/posts/${id}`, body);
}

export function deletePost(id: number) {
  return api.delete<{ success: boolean }>(`/posts/${id}`);
}
