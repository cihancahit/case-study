import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('token') || '',
  me: JSON.parse(localStorage.getItem('me') || 'null'),
  setAuth: ({ token, me }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('me', JSON.stringify(me));
    set({ token, me });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    set({ token: '', me: null });
  },
}));
