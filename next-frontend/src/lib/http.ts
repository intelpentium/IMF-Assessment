import axios, { AxiosError } from 'axios';

export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    validateStatus: (status) => status >= 200 && status < 300,
    timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
    return config;
});

apiClient.interceptors.response.use(
    (res) => res.data,
    (err: AxiosError<any>) => {
        const server = err.response?.data as any | undefined;
        const message =
            server?.error?.message ||
            server?.message ||
            err.message ||
            'Request failed';
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
