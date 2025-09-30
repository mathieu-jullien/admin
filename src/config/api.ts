export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
};
