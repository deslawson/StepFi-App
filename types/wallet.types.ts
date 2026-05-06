export interface WalletSession {
  publicKey: string;
  connectedAt: string;
}

export interface SignXdrResult {
  signedXdr: string;
}

export type WalletConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';
