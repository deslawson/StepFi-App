export type LoanStatus = 'pending' | 'active' | 'paid' | 'defaulted' | 'cancelled';

export type LoanType = 'standard' | 'learner_installment';

export interface Installment {
  dueDate: string;
  amount: number;
  paid: boolean;
  paidAt?: string;
}

export interface Loan {
  id: string;
  walletAddress: string;
  vendorId: string;
  totalAmount: number;
  remainingBalance: number;
  status: LoanStatus;
  loanType: LoanType;
  installments: Installment[];
  createdAt: string;
}
