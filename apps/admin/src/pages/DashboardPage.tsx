import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Coins,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { MOCK_DAILY_TREND } from '../data/adminStore';
import { Transaction } from '@sirkula/shared-types';

export const DashboardPage: React.FC = () => {
  const { machines, transactions, kpis, simulateLiveTransaction, resetDemoData } = useAdmin();
  const [trendMetric, setTrendMetric] = useState<'unit' | 'kg'>('unit');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const totalUnits = kpis.totalPetUnits + kpis.totalAluUnits;
  const totalKg = Number((kpis.totalPetKg + kpis.totalAluKg).toFixed(2));
  const recentTx = transactions.slice(0, 5);

  const petPct = totalUnits > 0 ? Math.round((kpis.totalPetUnits / totalUnits) * 100) : 65;
  const aluPct = 100 - petPct;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Ringkasan Operasional
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Metrik agregat pengumpulan material dan kinerja validasi sensor Smart RVM secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDemoData}
            className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition flex items-center gap-1.5"
            title="Kembalikan data ke awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={simulateLiveTransaction}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulasi Transaksi</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Material Terkumpul</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">{totalUnits} unit</div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Setara {totalKg} kg</span>
            <span className="text-emerald-600 font-semibold font-mono">100% Terpilah</span>
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Reward Diterbitkan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {kpis.totalPointsIssued.toLocaleString('id-ID')} Poin
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Rp{(kpis.totalPointsIssued * 10).toLocaleString('id-ID')} estimasi</span>
            <span className="text-primary font-semibold font-mono">Anti Double-Claim</span>
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Kesiapan Mesin RVM</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {kpis.activeMachinesCount}/{kpis.totalMachinesCount} Unit
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Kapasitas Rata-rata 58%</span>
            <span className="text-emerald-600 font-semibold font-mono">● Online</span>
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Kemurnian Material</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {kpis.cleanRecyclingRatePct}% Bersih
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>HX711 Anti-Air Aktif</span>
            <span className="text-emerald-600 font-semibold font-mono">0% Kontaminasi</span>
          </div>
        </div>
      </div>

      {/* Row 2: Trend Chart & Material Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Visual (8 cols) */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">Tren Pengumpulan 14 Hari</h2>
              <p className="text-[11px] text-muted-foreground">Penerimaan harian kemasan PET dan Aluminium dari seluruh unit.</p>
            </div>
            <div className="bg-muted p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setTrendMetric('unit')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  trendMetric === 'unit'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Unit
              </button>
              <button
                onClick={() => setTrendMetric('kg')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  trendMetric === 'kg'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Berat (kg)
              </button>
            </div>
          </div>

          {/* Trend Bar Chart */}
          <div className="h-60 flex items-end gap-2 pt-6 pb-2 px-1">
            {MOCK_DAILY_TREND.map((item, idx) => {
              const maxVal = trendMetric === 'unit' ? 400 : 8;
              const currentVal = trendMetric === 'unit' ? item.petUnits + item.aluUnits : item.petKg + item.aluKg;
              const heightPct = Math.min(100, Math.round((currentVal / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg z-20 whitespace-nowrap pointer-events-none">
                    <span className="font-bold">{item.label}</span>
                    <span>PET: {trendMetric === 'unit' ? `${item.petUnits} u` : `${item.petKg} kg`}</span>
                    <span>Alu: {trendMetric === 'unit' ? `${item.aluUnits} u` : `${item.aluKg} kg`}</span>
                  </div>

                  <div className="w-full bg-muted rounded-t-lg h-44 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 rounded-t-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground truncate w-full text-center">
                    {item.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-border text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>Botol PET (Rp100/u)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Kaleng Aluminium (Rp300/u)</span>
              </span>
            </div>
            <span className="font-mono text-[11px]">Rata-rata: 284 kemasan/hari</span>
          </div>
        </div>

        {/* Material Composition (4 cols) */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Proporsi Material</h2>
            <p className="text-[11px] text-muted-foreground">Komposisi kemasan terpilah saat ini.</p>
          </div>

          {/* Simple Radial Visual */}
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Botol Plastik PET
                </span>
                <span className="font-mono font-bold text-foreground">{kpis.totalPetUnits} u ({petPct}%)</span>
              </div>
              <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${petPct}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Kaleng Aluminium
                </span>
                <span className="font-mono font-bold text-foreground">{kpis.totalAluUnits} u ({aluPct}%)</span>
              </div>
              <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${aluPct}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-muted/60 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Berat PET:</span>
              <span className="font-mono font-bold text-foreground">{kpis.totalPetKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Berat Alu:</span>
              <span className="font-mono font-bold text-foreground">{kpis.totalAluKg} kg</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 font-semibold">
              <span className="text-foreground">Akumulasi Bersih:</span>
              <span className="font-mono text-primary font-bold">{totalKg} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions + Machine Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions (8 cols) */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">Aktivitas Transaksi Terbaru</h2>
              <p className="text-[11px] text-muted-foreground">Log penyetoran kemasan dan hasil verifikasi sensor.</p>
            </div>
            <Link
              to="/transaksi"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>Semua Transaksi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2.5 font-semibold">ID &amp; Waktu</th>
                  <th className="pb-2.5 font-semibold">Pengguna</th>
                  <th className="pb-2.5 font-semibold">Mesin</th>
                  <th className="pb-2.5 font-semibold">Material</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold text-right">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTx.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-muted/50 transition cursor-pointer"
                  >
                    <td className="py-3 font-mono">
                      <span className="font-semibold text-foreground block">{tx.id}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </td>
                    <td className="py-3 text-foreground font-medium">{tx.userName}</td>
                    <td className="py-3 text-muted-foreground truncate max-w-[140px]">{tx.machineName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground">
                        {tx.material} ({tx.weightG}g)
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'ACCEPTED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {tx.status === 'ACCEPTED' ? 'Diterima' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-primary">
                      {tx.rewardPoints > 0 ? `+${tx.rewardPoints}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Machine Quick Status (4 cols) */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">Status Unit RVM</h2>
              <p className="text-[11px] text-muted-foreground">Kapasitas wadah &amp; jaringan mesin.</p>
            </div>
            <Link
              to="/mesin"
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              Detail
            </Link>
          </div>

          <div className="space-y-3">
            {machines.map((machine) => {
              const petFill = Math.round((machine.petCount / machine.petCap) * 100);
              return (
                <div
                  key={machine.id}
                  className="p-3 rounded-xl border border-border bg-background/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground block">{machine.id}</span>
                      <h4 className="text-xs font-bold text-foreground truncate max-w-[160px]">{machine.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        machine.status === 'online'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : machine.status === 'warning'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {machine.statusLabel}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Kapasitas Wadah PET</span>
                      <span className="font-mono font-bold text-foreground">{petFill}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${petFill > 85 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${petFill}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slide-over Transaction Detail Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Verifikasi Multi-Modal
                </span>
                <h3 className="text-base font-bold text-foreground">{selectedTx.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-xl border border-border text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-xl space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengguna:</span>
                  <span className="font-bold text-foreground">{selectedTx.userName} ({selectedTx.userId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mesin:</span>
                  <span className="font-bold text-foreground">{selectedTx.machineName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu:</span>
                  <span className="font-bold text-foreground">{new Date(selectedTx.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Berat Terukur:</span>
                  <span className="font-bold text-foreground">{selectedTx.weightG} gram</span>
                </div>
              </div>

              {/* Multi-stage Sensor Verification List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground">Tahapan Validasi Sensor AIoT</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Inisiasi QR Session Token</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Valid</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>2. Computer Vision (MobileNetV3)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">
                      {Math.round((selectedTx.aiConfidence || 0.95) * 100)}% Match
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {selectedTx.verificationStages?.weightValidated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>3. Load Cell HX711 (Bobot Kosong)</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        selectedTx.verificationStages?.weightValidated ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {selectedTx.verificationStages?.weightValidated ? 'Lolos (Kering)' : 'Anomali Berat'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>4. Motor Diverter Sorter</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Wadah Terpilih</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>5. Idempotent Ledger Transaction</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Tercatat</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
