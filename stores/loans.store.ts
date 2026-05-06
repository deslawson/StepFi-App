import { create } from 'zustand';
import type { Loan } from '../types/loan.types';

interface LoansState {
  loans: Loan[];
  selectedLoan: Loan | null;
  isLoading: boolean;
  setLoans: (loans: Loan[]) => void;
  selectLoan: (id: string) => void;
  clearLoans: () => void;
  setLoading: (loading: boolean) => void;
}

export const useLoansStore = create<LoansState>((set, get) => ({
  loans: [],
  selectedLoan: null,
  isLoading: false,

  setLoans: (loans) => set({ loans }),

  selectLoan: (id) => {
    const loan = get().loans.find((l) => l.id === id) ?? null;
    set({ selectedLoan: loan });
  },

  clearLoans: () => set({ loans: [], selectedLoan: null }),

  setLoading: (isLoading) => set({ isLoading }),
}));
