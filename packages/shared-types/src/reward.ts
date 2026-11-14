import { MaterialCategory } from './material';

export interface RewardRule {
  id: string;
  material: MaterialCategory;
  name: string;
  pointsPerUnit: number;
  estMarketPricePerKg: number;
  enabled: boolean;
  effectiveFrom: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: 'Voucher' | 'Food' | 'Merchandise' | 'E-Wallet';
  pointsRequired: number;
  imageUrl?: string;
  stock: number;
  isAvailable: boolean;
}

export interface RedemptionRecord {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  code?: string;
  createdAt: string;
}
