export const ENV = {
  API_URL: import.meta.env.VITE_BACKEND_API_URL,
};

if (!ENV.API_URL) {
  throw new Error('VITE_BACKEND_API_URL is missing');
}
