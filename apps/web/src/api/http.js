import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Backend error format: { error: { code, message, details, requestId } }
    const data = err?.response?.data;
    const msg = data?.error?.message || err.message || 'Request failed';
    err.userMessage = msg;
    err.errorCode = data?.error?.code;
    err.requestId = data?.error?.requestId;
    return Promise.reject(err);
  }
);
