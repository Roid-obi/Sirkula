import { MaterialCategory } from './material';

export type BatchStatus = 'OPEN' | 'SEALED' | 'IN_TRANSIT' | 'DELIVERED';

export interface MaterialBatch {
  id: string;
  material: MaterialCategory;
  totalWeightKg: number;
  containerCount: number;
  sourceMachineId: string;
  sourceMachineName: string;
  destinationPartner: string;
  status: BatchStatus;
  statusLabel: string;
  createdAt: string;
  handedOverAt?: string;
  notes?: string;
}
