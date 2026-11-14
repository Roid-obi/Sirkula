import {
  RvmMachine,
  Transaction,
  RewardRule,
  RewardItem,
  AnomalyEvent,
  MaterialBatch,
  UserProfile
} from '@sirkula/shared-types';

export const MOCK_USER: UserProfile = {
  id: 'USR-UNS-0082',
  name: 'Budi Santoso',
  email: 'budi.santoso@student.uns.ac.id',
  phone: '0812-3456-7890',
  pointsBalance: 480,
  totalTransactions: 36,
  totalPetCount: 28,
  totalAluCount: 14,
  totalWeightKg: 0.94,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  joinedAt: '2026-10-01'
};

export const MOCK_MACHINES: RvmMachine[] = [
  {
    id: 'RVM-UNS-01',
    name: 'Perpustakaan Pusat UNS',
    zone: 'Kampus Kentingan · Lantai 1 Lobby',
    lat: -7.55835,
    lng: 110.85602,
    status: 'online',
    statusLabel: 'Online',
    isMvp: true,
    tier: 'Prototipe MVP',
    controller: 'ESP32-S3 + Cam OV2640',
    cvModel: 'SirkulaCV-MobileNetV3 v1.2',
    sensors: 'Load Cell HX711 + IR Proximity',
    wifiRssi: '-54 dBm (Stabil)',
    lastSync: 'Baru saja',
    tempC: 31.4,
    petCount: 136,
    petCap: 200,
    petKg: 2.65,
    aluCount: 78,
    aluCap: 150,
    aluKg: 1.12,
    todayTx: 64,
    uptimePct: 99.4,
    address: 'Jl. Ir. Sutami No. 36A, Jebres, Surakarta',
    operatingHours: '07:30 - 20:00 WIB'
  },
  {
    id: 'RVM-UNS-02',
    name: 'Gedung B FMIPA UNS',
    zone: 'Kampus Kentingan · Koridor Utama',
    lat: -7.55985,
    lng: 110.85420,
    status: 'warning',
    statusLabel: 'Hampir Penuh',
    isMvp: false,
    tier: 'Simulasi Jaringan',
    controller: 'ESP32-S3 + Cam OV2640',
    cvModel: 'SirkulaCV-MobileNetV3 v1.2',
    sensors: 'Load Cell HX711 + IR Proximity',
    wifiRssi: '-61 dBm (Baik)',
    lastSync: '1 menit lalu',
    tempC: 32.8,
    petCount: 178,
    petCap: 200,
    petKg: 3.47,
    aluCount: 114,
    aluCap: 150,
    aluKg: 1.63,
    todayTx: 89,
    uptimePct: 98.9,
    address: 'Fakultas MIPA UNS, Kentingan, Surakarta',
    operatingHours: '08:00 - 17:00 WIB'
  },
  {
    id: 'RVM-UNS-03',
    name: 'Kantin Fakultas Teknik UNS',
    zone: 'Kampus Kentingan · Area Kantin',
    lat: -7.56205,
    lng: 110.85805,
    status: 'online',
    statusLabel: 'Online',
    isMvp: false,
    tier: 'Simulasi Jaringan',
    controller: 'ESP32-S3 + Cam OV2640',
    cvModel: 'SirkulaCV-MobileNetV3 v1.2',
    sensors: 'Load Cell HX711 + IR Proximity',
    wifiRssi: '-58 dBm (Stabil)',
    lastSync: '3 menit lalu',
    tempC: 33.1,
    petCount: 92,
    petCap: 200,
    petKg: 1.79,
    aluCount: 104,
    aluCap: 150,
    aluKg: 1.49,
    todayTx: 74,
    uptimePct: 99.1,
    address: 'Gedung Kantin FT UNS, Kentingan, Surakarta',
    operatingHours: '08:00 - 18:00 WIB'
  },
  {
    id: 'RVM-UNS-04',
    name: 'Student Center (SC) UNS',
    zone: 'Kampus Kentingan · Area Barat',
    lat: -7.55745,
    lng: 110.85330,
    status: 'online',
    statusLabel: 'Online',
    isMvp: false,
    tier: 'Simulasi Jaringan',
    controller: 'ESP32-S3 + Cam OV2640',
    cvModel: 'SirkulaCV-MobileNetV3 v1.2',
    sensors: 'Load Cell HX711 + IR Proximity',
    wifiRssi: '-66 dBm (Cukup)',
    lastSync: '4 menit lalu',
    tempC: 30.9,
    petCount: 84,
    petCap: 200,
    petKg: 1.64,
    aluCount: 42,
    aluCap: 150,
    aluKg: 0.60,
    todayTx: 41,
    uptimePct: 97.6,
    address: 'Student Center UNS, Kentingan, Surakarta',
    operatingHours: '08:00 - 21:00 WIB'
  }
];

export const MOCK_REWARD_RULES: RewardRule[] = [
  {
    id: 'RULE-PET-01',
    material: 'PET',
    name: 'Botol Plastik Minuman PET',
    pointsPerUnit: 10,
    estMarketPricePerKg: 3500,
    enabled: true,
    effectiveFrom: '2026-11-01'
  },
  {
    id: 'RULE-ALU-01',
    material: 'ALUMINUM',
    name: 'Kaleng Minuman Aluminium',
    pointsPerUnit: 20,
    estMarketPricePerKg: 14000,
    enabled: true,
    effectiveFrom: '2026-11-01'
  },
  {
    id: 'RULE-UNK-01',
    material: 'UNKNOWN',
    name: 'Objek Tidak Dikenali / Reject',
    pointsPerUnit: 0,
    estMarketPricePerKg: 0,
    enabled: true,
    effectiveFrom: '2026-11-01'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-UNS-10291',
    sessionId: 'SES-9482-10291',
    userId: 'USR-UNS-0082',
    userName: 'Budi Santoso',
    machineId: 'RVM-UNS-01',
    machineName: 'Perpustakaan Pusat UNS',
    timestamp: '2026-11-14T11:15:20Z',
    material: 'PET',
    materialLabel: 'Botol Plastik PET',
    weightG: 19.5,
    weightKg: 0.0195,
    status: 'ACCEPTED',
    statusLabel: 'Diterima & Reward Diberikan',
    rewardPoints: 10,
    aiConfidence: 0.96,
    modelVersion: 'SirkulaCV-MobileNetV3 v1.2',
    idempotencyKey: 'IDEMP-RVM01-10291-01',
    verificationStages: {
      qrAuthorized: true,
      aiInspected: true,
      weightValidated: true,
      actuatorConfirmed: true,
      ledgerRecorded: true
    }
  },
  {
    id: 'TXN-UNS-10290',
    sessionId: 'SES-9481-10290',
    userId: 'USR-UNS-0082',
    userName: 'Budi Santoso',
    machineId: 'RVM-UNS-01',
    machineName: 'Perpustakaan Pusat UNS',
    timestamp: '2026-11-14T11:14:02Z',
    material: 'ALUMINUM',
    materialLabel: 'Kaleng Aluminium',
    weightG: 14.8,
    weightKg: 0.0148,
    status: 'ACCEPTED',
    statusLabel: 'Diterima & Reward Diberikan',
    rewardPoints: 20,
    aiConfidence: 0.94,
    modelVersion: 'SirkulaCV-MobileNetV3 v1.2',
    idempotencyKey: 'IDEMP-RVM01-10290-01',
    verificationStages: {
      qrAuthorized: true,
      aiInspected: true,
      weightValidated: true,
      actuatorConfirmed: true,
      ledgerRecorded: true
    }
  },
  {
    id: 'TXN-UNS-10289',
    sessionId: 'SES-9480-10289',
    userId: 'USR-UNS-0104',
    userName: 'Ahmad Fauzi',
    machineId: 'RVM-UNS-02',
    machineName: 'Gedung B FMIPA UNS',
    timestamp: '2026-11-14T10:48:11Z',
    material: 'UNKNOWN',
    materialLabel: 'Objek Tidak Dikenal',
    weightG: 45.2,
    weightKg: 0.0452,
    status: 'REJECTED',
    statusLabel: 'Ditolak (Benda Asing)',
    rewardPoints: 0,
    aiConfidence: 0.38,
    modelVersion: 'SirkulaCV-MobileNetV3 v1.2',
    rejectReason: 'Objek tidak cocok dengan fitur visual PET/Aluminium atau berat melebihi batas kosong',
    verificationStages: {
      qrAuthorized: true,
      aiInspected: true,
      weightValidated: false,
      actuatorConfirmed: true,
      ledgerRecorded: false
    }
  }
];

export const MOCK_REWARD_ITEMS: RewardItem[] = [
  {
    id: 'RWD-01',
    title: 'Voucher Kantin UNS Rp10.000',
    description: 'Dapat digunakan di seluruh kantin kampus UNS Kentingan.',
    category: 'Voucher',
    pointsRequired: 100,
    stock: 50,
    isAvailable: true
  },
  {
    id: 'RWD-02',
    title: 'Saldo E-Wallet Rp20.000',
    description: 'Top-up saldo GoPay / OVO / ShopeePay.',
    category: 'E-Wallet',
    pointsRequired: 200,
    stock: 35,
    isAvailable: true
  },
  {
    id: 'RWD-03',
    title: 'Tumbler Stainless Sirkula 500ml',
    description: 'Tumbler ramah lingkungan edisi eksklusif Sirkula UNS 2026.',
    category: 'Merchandise',
    pointsRequired: 350,
    stock: 20,
    isAvailable: true
  },
  {
    id: 'RWD-04',
    title: 'Voucher Fotokopi & Print Rp5.000',
    description: 'Berlaku di Koperasi Mahasiswa (Kopma) UNS.',
    category: 'Voucher',
    pointsRequired: 50,
    stock: 100,
    isAvailable: true
  }
];

export const MOCK_BATCHES: MaterialBatch[] = [
  {
    id: 'BATCH-2026-PET-001',
    material: 'PET',
    totalWeightKg: 42.5,
    containerCount: 2180,
    sourceMachineId: 'RVM-UNS-01',
    sourceMachineName: 'Perpustakaan Pusat UNS',
    destinationPartner: 'Bank Sampah Induk Surakarta',
    status: 'DELIVERED',
    statusLabel: 'Diserahkan ke Mitra',
    createdAt: '2026-11-10T14:00:00Z',
    handedOverAt: '2026-11-11T09:30:00Z',
    notes: 'Kemasan bersih terpilah kualitas tinggi (Grade A)'
  },
  {
    id: 'BATCH-2026-ALU-001',
    material: 'ALUMINUM',
    totalWeightKg: 18.2,
    containerCount: 1250,
    sourceMachineId: 'RVM-UNS-03',
    sourceMachineName: 'Kantin Fakultas Teknik UNS',
    destinationPartner: 'PT Solo Daur Ulang Mandiri',
    status: 'SEALED',
    statusLabel: 'Disegel Siap Angkut',
    createdAt: '2026-11-13T16:00:00Z',
    notes: 'Kaleng aluminium bersih siap press baler'
  }
];

export const MOCK_ANOMALIES: AnomalyEvent[] = [
  {
    id: 'ANOM-2026-081',
    code: 'LIQUID_CONTAMINATION',
    type: 'Cairan Berlebih Terdeteksi',
    severity: 'MEDIUM',
    machineId: 'RVM-UNS-02',
    machineName: 'Gedung B FMIPA UNS',
    description: 'Kemasan botol berisi sisa cairan terdeteksi berat 185g (ambang batas kosong maks 35g). Objek otomatis dialihkan ke jalur reject.',
    occurredAt: '2026-11-14T09:12:00Z',
    status: 'RESOLVED',
    notes: 'Mekanisme servo reject berhasil mengembalikan kemasan ke pengguna'
  },
  {
    id: 'ANOM-2026-082',
    code: 'BIN_NEAR_CAPACITY',
    type: 'Kapasitas Wadah Mendekati 90%',
    severity: 'HIGH',
    machineId: 'RVM-UNS-02',
    machineName: 'Gedung B FMIPA UNS',
    description: 'Kompartemen PET mencapai 178/200 botol. Petugas fasilitas telah menerima notifikasi pengangkutan.',
    occurredAt: '2026-11-14T10:30:00Z',
    status: 'INVESTIGATING'
  }
];
