import { MaterialCategory } from './material';

export type TransactionStatus = 'ACCEPTED' | 'REJECTED' | 'FAILED' | 'PENDING' | 'NEEDS_REVIEW' | 'CANCELLED';

export interface Transaction {
  id: string;
  sessionId: string;
  userId?: string;
  userName?: string;
  machineId: string;
  machineName?: string;
  timestamp: string;
  material: MaterialCategory;
  materialLabel: string;
  weightG: number;
  weightKg: number;
  status: TransactionStatus;
  statusLabel: string;
  rewardPoints: number;
  aiConfidence?: number;
  modelVersion?: string;
  idempotencyKey?: string;
  rejectReason?: string;
  verificationStages?: {
    qrAuthorized: boolean;
    aiInspected: boolean;
    weightValidated: boolean;
    actuatorConfirmed: boolean;
    ledgerRecorded: boolean;
  };
}
