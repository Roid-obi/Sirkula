export type MachineStatus = 'online' | 'warning' | 'offline' | 'maintenance';

export interface RvmMachine {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  status: MachineStatus;
  statusLabel: string;
  isMvp: boolean;
  tier: string;
  controller: string;
  cvModel: string;
  sensors: string;
  wifiRssi: string;
  lastSync: string;
  tempC: number;
  petCount: number;
  petCap: number;
  petKg: number;
  aluCount: number;
  aluCap: number;
  aluKg: number;
  todayTx: number;
  uptimePct: number;
  address?: string;
  operatingHours?: string;
}
