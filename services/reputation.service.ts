import api from './api';

export interface ReputationScore {
  score: number;
  tier: string;
  interestRate: number;
  maxCredit: number;
}

export const reputationService = {
  async getScore(wallet: string): Promise<ReputationScore> {
    const res = await api.get<ReputationScore>(`/reputation/${wallet}`);
    return res.data;
  },
};
