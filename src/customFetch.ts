import { useAuthStore } from '@/store/auth';
import { ENV } from './config/env';

interface FetcherParams {
  url: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export const fetcher = async <T = unknown>({
  url,
  method,
  data,
  headers,
  signal,
}: FetcherParams): Promise<T> => {
  const { accessToken } = useAuthStore.getState();

  const res = await fetch(`${ENV.API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers || {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  // If access token expired, try refresh
  if (res.status === 401) {
    return handleRefreshAndRetry<T>({ url, method, data, headers, signal });
  }

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  // console.log(envConfig.backendApiUrl,"url backend")

  return res.json() as Promise<T>;
};

const handleRefreshAndRetry = async <T>({
  url,
  method,
  data,
  headers,
  signal,
}: FetcherParams): Promise<T> => {
  const { refreshToken, logout, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    throw new Error('Not authenticated. Refresh token missing.');
  }

  // Call refresh API
  const refreshRes = await fetch(`${ENV.API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!refreshRes.ok) {
    logout();
    throw new Error('Session expired. Login again.');
  }

  const refreshData: { access_token: string; refresh_token: string } = await refreshRes.json();

  // Save new tokens in Zustand and localStorage
  setTokens(refreshData.access_token, refreshData.refresh_token);

  // Retry original request with new access token
  return fetcher<T>({ url, method, data, headers, signal });
};
