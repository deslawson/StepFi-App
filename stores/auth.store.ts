import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const ACCESS_TOKEN_KEY = 'stepfi.accessToken';
const REFRESH_TOKEN_KEY = 'stepfi.refreshToken';
const WALLET_KEY = 'stepfi.walletAddress';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setWallet: (address: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

async function secureSet(key: string, value: string | null): Promise<void> {
  if (value === null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  walletAddress: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    const [accessToken, refreshToken, walletAddress] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(WALLET_KEY),
    ]);
    set({
      accessToken,
      refreshToken,
      walletAddress,
      isAuthenticated: Boolean(accessToken && refreshToken),
      isLoading: false,
    });
  },

  setTokens: async (access, refresh) => {
    await Promise.all([
      secureSet(ACCESS_TOKEN_KEY, access),
      secureSet(REFRESH_TOKEN_KEY, refresh),
    ]);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setWallet: async (address) => {
    await secureSet(WALLET_KEY, address);
    set({ walletAddress: address });
  },

  clearAuth: async () => {
    await Promise.all([
      secureSet(ACCESS_TOKEN_KEY, null),
      secureSet(REFRESH_TOKEN_KEY, null),
      secureSet(WALLET_KEY, null),
    ]);
    set({
      accessToken: null,
      refreshToken: null,
      walletAddress: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
