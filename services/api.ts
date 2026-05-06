import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { config } from '../constants/config';
import { useAuthStore } from '../stores/auth.store';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((req) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    req.headers = req.headers ?? {};
    (req.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

interface RetriableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();
  if (!refreshToken) {
    await clearAuth();
    return null;
  }

  try {
    const res = await axios.post<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>(`${config.API_BASE_URL}/auth/refresh`, { refreshToken }, { timeout: 10000 });
    await setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data.accessToken;
  } catch {
    await clearAuth();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequest | undefined;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshInFlight) {
      refreshInFlight = performRefresh().finally(() => {
        refreshInFlight = null;
      });
    }

    const newToken = await refreshInFlight;

    if (!newToken) {
      router.replace('/(auth)/sign-in');
      return Promise.reject(error);
    }

    original.headers = original.headers ?? {};
    (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
    return api.request(original);
  },
);

export default api;
