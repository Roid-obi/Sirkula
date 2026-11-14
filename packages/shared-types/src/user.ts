export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pointsBalance: number;
  totalTransactions: number;
  totalPetCount: number;
  totalAluCount: number;
  totalWeightKg: number;
  avatarUrl?: string;
  joinedAt: string;
}
