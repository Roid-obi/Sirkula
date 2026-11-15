import {
  RvmMachine,
  Transaction,
  RewardRule,
  RewardItem,
  AnomalyEvent,
  MaterialBatch
} from '@sirkula/shared-types';
import {
  MOCK_MACHINES,
  MOCK_TRANSACTIONS,
  MOCK_REWARD_RULES,
  MOCK_REWARD_ITEMS,
  MOCK_ANOMALIES,
  MOCK_BATCHES
} from '@sirkula/api-client';

export interface AdminKpi {
  totalPetKg: number;
  totalPetUnits: number;
  totalAluKg: number;
  totalAluUnits: number;
  totalPointsIssued: number;
  activeMachinesCount: number;
  totalMachinesCount: number;
  cleanRecyclingRatePct: number;
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  petUnits: number;
  petKg: number;
  aluUnits: number;
  aluKg: number;
}

// 14-day historical trend data for visualization
export const MOCK_DAILY_TREND: DailyTrendPoint[] = [
  { date: '2026-11-01', label: '1 Nov', petUnits: 142, petKg: 2.76, aluUnits: 68, aluKg: 0.98 },
  { date: '2026-11-02', label: '2 Nov', petUnits: 168, petKg: 3.27, aluUnits: 84, aluKg: 1.21 },
  { date: '2026-11-03', label: '3 Nov', petUnits: 195, petKg: 3.80, aluUnits: 92, aluKg: 1.32 },
  { date: '2026-11-04', label: '4 Nov', petUnits: 184, petKg: 3.58, aluUnits: 88, aluKg: 1.27 },
  { date: '2026-11-05', label: '5 Nov', petUnits: 210, petKg: 4.09, aluUnits: 104, aluKg: 1.50 },
  { date: '2026-11-06', label: '6 Nov', petUnits: 232, petKg: 4.52, aluUnits: 118, aluKg: 1.70 },
  { date: '2026-11-07', label: '7 Nov', petUnits: 176, petKg: 3.43, aluUnits: 72, aluKg: 1.04 },
  { date: '2026-11-08', label: '8 Nov', petUnits: 154, petKg: 3.00, aluUnits: 65, aluKg: 0.94 },
  { date: '2026-11-09', label: '9 Nov', petUnits: 245, petKg: 4.77, aluUnits: 122, aluKg: 1.76 },
  { date: '2026-11-10', label: '10 Nov', petUnits: 278, petKg: 5.42, aluUnits: 135, aluKg: 1.94 },
  { date: '2026-11-11', label: '11 Nov', petUnits: 295, petKg: 5.75, aluUnits: 148, aluKg: 2.13 },
  { date: '2026-11-12', label: '12 Nov', petUnits: 312, petKg: 6.08, aluUnits: 156, aluKg: 2.25 },
  { date: '2026-11-13', label: '13 Nov', petUnits: 340, petKg: 6.63, aluUnits: 172, aluKg: 2.48 },
  { date: '2026-11-14', label: '14 Nov', petUnits: 368, petKg: 7.18, aluUnits: 184, aluKg: 2.65 }
];

export const getStoredTransactions = (): Transaction[] => {
  const saved = localStorage.getItem('sirkula_admin_transactions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return MOCK_TRANSACTIONS;
};

export const getStoredMachines = (): RvmMachine[] => {
  const saved = localStorage.getItem('sirkula_admin_machines');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return MOCK_MACHINES;
};

export const getStoredAnomalies = (): AnomalyEvent[] => {
  const saved = localStorage.getItem('sirkula_admin_anomalies');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return MOCK_ANOMALIES;
};

export const getStoredRewardRules = (): RewardRule[] => {
  const saved = localStorage.getItem('sirkula_admin_reward_rules');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return MOCK_REWARD_RULES;
};

export const getStoredBatches = (): MaterialBatch[] => {
  const saved = localStorage.getItem('sirkula_admin_batches');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return MOCK_BATCHES;
};

export const calculateKpis = (
  machines: RvmMachine[],
  transactions: Transaction[]
): AdminKpi => {
  const petUnits = machines.reduce((acc, m) => acc + m.petCount, 0);
  const petKg = Number(machines.reduce((acc, m) => acc + m.petKg, 0).toFixed(2));
  const aluUnits = machines.reduce((acc, m) => acc + m.aluCount, 0);
  const aluKg = Number(machines.reduce((acc, m) => acc + m.aluKg, 0).toFixed(2));
  const totalPoints = transactions
    .filter((t) => t.status === 'ACCEPTED')
    .reduce((acc, t) => acc + t.rewardPoints, 0);

  const activeCount = machines.filter((m) => m.status !== 'offline').length;
  const acceptedTx = transactions.filter((t) => t.status === 'ACCEPTED').length;
  const cleanRate = transactions.length > 0
    ? Math.round((acceptedTx / transactions.length) * 100)
    : 98;

  return {
    totalPetKg: petKg,
    totalPetUnits: petUnits,
    totalAluKg: aluKg,
    totalAluUnits: aluUnits,
    totalPointsIssued: totalPoints,
    activeMachinesCount: activeCount,
    totalMachinesCount: machines.length,
    cleanRecyclingRatePct: cleanRate
  };
};
