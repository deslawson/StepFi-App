import api from './api';

export interface NonceResponse {
  nonce: string;
  expiresAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authService = {
  async getNonce(wallet: string): Promise<NonceResponse> {
    const res = await api.post<NonceResponse>('/auth/nonce', { wallet });
    return res.data;
  },

  async verify(wallet: string, nonce: string, signature: string): Promise<AuthTokens> {
    const res = await api.post<AuthTokens>('/auth/verify', { wallet, nonce, signature });
    return res.data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    return res.data;
  },
};
