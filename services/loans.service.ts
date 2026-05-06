import api from './api';
import type { Installment, Loan } from '../types/loan.types';

export interface AvailableCredit {
  available: number;
  limit: number;
  used: number;
}

export interface CreateLoanDto {
  vendorId: string;
  totalAmount: number;
  guaranteeAmount: number;
  schedule: Installment[];
}

export interface UnsignedXdrResponse {
  unsignedXdr: string;
}

export const loansService = {
  async getMyLoans(): Promise<Loan[]> {
    const res = await api.get<{ data: Loan[] }>('/loans/my-loans');
    return res.data.data;
  },

  async getLoanById(id: string): Promise<Loan> {
    const res = await api.get<Loan>(`/loans/${id}`);
    return res.data;
  },

  async getAvailableCredit(): Promise<AvailableCredit> {
    const res = await api.get<AvailableCredit>('/loans/available-credit');
    return res.data;
  },

  async createLoan(dto: CreateLoanDto): Promise<UnsignedXdrResponse> {
    const res = await api.post<UnsignedXdrResponse>('/loans/create', dto);
    return res.data;
  },

  async repayInstallment(
    loanId: string,
    installmentIndex: number,
    amount: number,
  ): Promise<UnsignedXdrResponse> {
    const res = await api.post<UnsignedXdrResponse>(`/loans/${loanId}/repay-installment`, {
      installmentIndex,
      amount,
    });
    return res.data;
  },
};
