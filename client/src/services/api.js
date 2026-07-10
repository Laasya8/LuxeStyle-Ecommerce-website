import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Wires the Axios instance to Clerk sessions so every request carries a
 * bearer token. Called once from AuthTokenProvider (see context/) since
 * Clerk's getToken() is only reachable from inside a component tree.
 */
export const attachAuthInterceptor = (getToken) => {
  const interceptorId = api.interceptors.request.use(async (config) => {
    const token = await getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return () => api.interceptors.request.eject(interceptorId);
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
