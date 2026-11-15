import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import {
  getStoredMachines,
  getStoredTransactions,
  getStoredAnomalies,
  getStoredRewardRules,
  getStoredBatches,
  calculateKpis,
  AdminKpi
} from '../data/adminStore';

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface AdminContextType {
  machines: RvmMachine[];
  transactions: Transaction[];
  anomalies: AnomalyEvent[];
  rewardRules: RewardRule[];
  rewardItems: RewardItem[];
  batches: MaterialBatch[];
  kpis: AdminKpi;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  toggleTheme: () => void;
  simulateLiveTransaction: () => void;
  resolveAnomaly: (id: string, newStatus: 'Dibuka' | 'Diproses' | 'Selesai') => void;
  toggleRewardRule: (id: string) => void;
  updateRewardRulePrice: (id: string, price: number, points: number) => void;
  resetDemoData: () => void;
  dismissToast: (id: string) => void;
  showToast: (title: string, description: string, type?: ToastMessage['type']) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<RvmMachine[]>(getStoredMachines);
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(getStoredAnomalies);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>(getStoredRewardRules);
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [batches, setBatches] = useState<MaterialBatch[]>(getStoredBatches);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sirkula_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sirkula_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (title: string, description: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sirkula_admin_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('sirkula_admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sirkula_admin_anomalies', JSON.stringify(anomalies));
  }, [anomalies]);

  useEffect(() => {
    localStorage.setItem('sirkula_admin_reward_rules', JSON.stringify(rewardRules));
  }, [rewardRules]);

  useEffect(() => {
    localStorage.setItem('sirkula_admin_batches', JSON.stringify(batches));
  }, [batches]);

  const kpis = calculateKpis(machines, transactions);

  // Live transaction simulation
  const simulateLiveTransaction = () => {
    const randomMachine = machines[Math.floor(Math.random() * machines.length)];
    const isPet = Math.random() > 0.35;
    const isAccepted = Math.random() > 0.08;

    const txId = `TXN-SRK-${Date.now().toString().slice(-5)}`;
    const weightG = isPet ? Number((18 + Math.random() * 8).toFixed(1)) : Number((14 + Math.random() * 4).toFixed(1));
    const rewardPoints = isAccepted ? (isPet ? 10 : 20) : 0;

    const newTx: Transaction = {
      id: txId,
      sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: `USR-${Math.floor(100 + Math.random() * 900)}`,
      userName: ['Budi Santoso', 'Siti Rahma', 'Ahmad Fauzi', 'Rina Wulandari'][Math.floor(Math.random() * 4)],
      machineId: randomMachine.id,
      machineName: randomMachine.name,
      timestamp: new Date().toISOString(),
      material: isAccepted ? (isPet ? 'PET' : 'ALUMINUM') : 'UNKNOWN',
      materialLabel: isAccepted ? (isPet ? 'Botol Plastik PET' : 'Kaleng Aluminium') : 'Objek Ditolak (Kontaminasi)',
      weightG,
      weightKg: Number((weightG / 1000).toFixed(4)),
      status: isAccepted ? 'ACCEPTED' : 'REJECTED',
      statusLabel: isAccepted ? 'Diterima & Terverifikasi' : 'Ditolak Sensor',
      rewardPoints,
      aiConfidence: isAccepted ? Number((0.92 + Math.random() * 0.07).toFixed(2)) : 0.42,
      modelVersion: 'SirkulaCV-MobileNetV3 v1.2',
      idempotencyKey: `IDEMP-${txId}`,
      verificationStages: {
        qrAuthorized: true,
        aiInspected: true,
        weightValidated: isAccepted,
        actuatorConfirmed: true,
        ledgerRecorded: isAccepted
      }
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update target machine capacity if accepted
    if (isAccepted) {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === randomMachine.id) {
            const nextPetCount = isPet ? m.petCount + 1 : m.petCount;
            const nextAluCount = !isPet ? m.aluCount + 1 : m.aluCount;
            const nextPetKg = isPet ? Number((m.petKg + weightG / 1000).toFixed(2)) : m.petKg;
            const nextAluKg = !isPet ? Number((m.aluKg + weightG / 1000).toFixed(2)) : m.aluKg;
            return {
              ...m,
              petCount: nextPetCount,
              aluCount: nextAluCount,
              petKg: nextPetKg,
              aluKg: nextAluKg,
              todayTx: m.todayTx + 1,
              lastSync: 'Baru saja'
            };
          }
          return m;
        })
      );
    }

    showToast(
      isAccepted ? `Setoran Berhasil: +${rewardPoints} Poin` : 'Peringatan Kontaminasi',
      `${newTx.materialLabel} di ${randomMachine.name}`,
      isAccepted ? 'success' : 'warning'
    );
  };

  const resolveAnomaly = (id: string, newStatus: 'Dibuka' | 'Diproses' | 'Selesai') => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, actionStatus: newStatus } : a))
    );
    showToast('Status Anomali Diperbarui', `ID: ${id} menjadi "${newStatus}"`, 'info');
  };

  const toggleRewardRule = (id: string) => {
    setRewardRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateRewardRulePrice = (id: string, price: number, points: number) => {
    setRewardRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estMarketPricePerKg: price, pointsPerUnit: points } : r))
    );
    showToast('Aturan Reward Disimpan', `Harga dan poin material telah diperbarui.`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem('sirkula_admin_machines');
    localStorage.removeItem('sirkula_admin_transactions');
    localStorage.removeItem('sirkula_admin_anomalies');
    localStorage.removeItem('sirkula_admin_reward_rules');
    localStorage.removeItem('sirkula_admin_batches');

    setMachines(MOCK_MACHINES);
    setTransactions(MOCK_TRANSACTIONS);
    setAnomalies(MOCK_ANOMALIES);
    setRewardRules(MOCK_REWARD_RULES);
    setBatches(MOCK_BATCHES);

    showToast('Data Direset', 'Semua data operasional dikembalikan ke kondisi default prototipe.', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        machines,
        transactions,
        anomalies,
        rewardRules,
        rewardItems,
        batches,
        kpis,
        theme,
        toasts,
        toggleTheme,
        simulateLiveTransaction,
        resolveAnomaly,
        toggleRewardRule,
        updateRewardRulePrice,
        resetDemoData,
        dismissToast,
        showToast
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
