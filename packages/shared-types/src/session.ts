import { MaterialCategory } from './material';
import { Transaction } from './transaction';

export type SessionStep =
  | 'WAITING_INSERT'
  | 'OBJECT_DETECTED'
  | 'AI_INSPECTING'
  | 'WEIGHT_MEASURING'
  | 'VALIDATING'
  | 'SORTING_ACTUATING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'FAILED';

export interface DepositSession {
  id: string;
  userId: string;
  machineId: string;
  machineName: string;
  startedAt: string;
  currentStep: SessionStep;
  predictedMaterial?: MaterialCategory;
  aiConfidence?: number;
  measuredWeightG?: number;
  transaction?: Transaction;
  errorMessage?: string;
}
