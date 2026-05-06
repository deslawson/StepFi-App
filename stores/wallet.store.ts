import { create } from 'zustand';
import type { WalletConnectionStatus } from '../types/wallet.types';

interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  status: WalletConnectionStatus;
  isSigning: boolean;
  setConnected: (publicKey: string) => void;
  setDisconnected: () => void;
  setSigning: (signing: boolean) => void;
  setStatus: (status: WalletConnectionStatus) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  publicKey: null,
  status: 'disconnected',
  isSigning: false,

  setConnected: (publicKey) =>
    set({ isConnected: true, publicKey, status: 'connected' }),

  setDisconnected: () =>
    set({ isConnected: false, publicKey: null, status: 'disconnected', isSigning: false }),

  setSigning: (isSigning) => set({ isSigning }),

  setStatus: (status) => set({ status }),
}));
