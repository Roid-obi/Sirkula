export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AnomalyEvent {
  id: string;
  code: string;
  type: string;
  severity: AnomalySeverity;
  machineId: string;
  machineName: string;
  description: string;
  occurredAt: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED';
  resolvedAt?: string;
  notes?: string;
}
