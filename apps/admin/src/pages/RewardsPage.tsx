import React, { useState } from 'react';
import {
  Coins,
  Save,
  Sliders,
  DollarSign,
  TrendingUp,
  Tag,
  Gift,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Percent
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const RewardsPage: React.FC = () => {
  const { rewardRules, rewardItems, updateRewardRulePrice, toggleRewardRule, showToast } = useAdmin();

  // Local state for editable reward rule inputs
  const [editableRules, setEditableRules] = useState<{
    [id: string]: { price: number; points: number };
  }>(() => {
    const initial: { [id: string]: { price: number; points: number } } = {};
    rewardRules.forEach((r) => {
      initial[r.id] = { price: r.estMarketPricePerKg, points: r.pointsPerUnit };
    });
    return initial;
  });

  // Simulator parameters
  const [simPetUnits, setSimPetUnits] = useState<number>(6000);
  const [simAluUnits, setSimAluUnits] = useState<number>(3200);
  const [simOpsCost, setSimOpsCost] = useState<number>(350000);
  const [simCsrSupport, setSimCsrSupport] = useState<number>(500000);

  // Financial simulation calculations
  // Average weights: PET ~ 20g (0.02kg), ALU ~ 15g (0.015kg)
  const petPricePerKg = editableRules['RULE-PET']?.price || 3800;
  const aluPricePerKg = editableRules['RULE-ALU']?.price || 14500;
  const petPointsPerUnit = editableRules['RULE-PET']?.points || 10;
  const aluPointsPerUnit = editableRules['RULE-ALU']?.points || 20;
  const pointNominalValueRp = 10; // 1 Poin = Rp10

  const estPetKg = simPetUnits * 0.02;
  const estAluKg = simAluUnits * 0.015;

  const revenueScrapPet = estPetKg * petPricePerKg;
  const revenueScrapAlu = estAluKg * aluPricePerKg;
  const totalScrapRevenue = revenueScrapPet + revenueScrapAlu;

  const totalPointsIssued = simPetUnits * petPointsPerUnit + simAluUnits * aluPointsPerUnit;
  const totalUserRewardPayoutRp = totalPointsIssued * pointNominalValueRp;

  const totalRevenue = totalScrapRevenue + simCsrSupport;
  const totalCost = totalUserRewardPayoutRp + simOpsCost;
  const netOperatingMargin = totalRevenue - totalCost;
  const marginPercentage = totalRevenue > 0 ? Math.round((netOperatingMargin / totalRevenue) * 100) : 0;

  const handleSaveRule = (ruleId: string) => {
    const updated = editableRules[ruleId];
    if (updated) {
      updateRewardRulePrice(ruleId, updated.price, updated.points);
    }
  };

  const handleSaveAll = () => {
    Object.keys(editableRules).forEach((ruleId) => {
      const updated = editableRules[ruleId];
      if (updated) {
        updateRewardRulePrice(ruleId, updated.price, updated.points);
      }
    });
    showToast('Konfigurasi Disimpan', 'Seluruh aturan harga pasar dan poin reward berhasil diperbarui.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Reward & Valuasi Ekonomi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Konfigurasi rasio insentif pengguna, harga jual mitra daur ulang, dan kalkulator margin operasional mandiri.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      {/* Reward Rules Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Aturan Nilai Reward & Kriteria Fisik Material
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ambang toleransi sensor load cell HX711 dan perolehan poin per jenis kemasan yang divalidasi.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Kategori Kemasan</th>
                <th className="px-5 py-3">Rentang Berat Valid</th>
                <th className="px-5 py-3">Harga Jual Mitra (/kg)</th>
                <th className="px-5 py-3">Reward Pengguna (/unit)</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {rewardRules.map((rule) => {
                const currentEdit = editableRules[rule.id] || {
                  price: rule.estMarketPricePerKg,
                  points: rule.pointsPerUnit
                };

                return (
                  <tr key={rule.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggleRewardRule(rule.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          rule.enabled
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            rule.enabled ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {rule.enabled ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {rule.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{rule.material}</div>
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                      {rule.material === 'PET' ? '12g – 35g' : '11g – 25g'}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-slate-400">Rp</span>
                        <input
                          type="number"
                          value={currentEdit.price}
                          onChange={(e) =>
                            setEditableRules((prev) => ({
                              ...prev,
                              [rule.id]: {
                                ...currentEdit,
                                price: Math.max(0, parseInt(e.target.value) || 0)
                              }
                            }))
                          }
                          className="w-24 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <span className="text-slate-400">/kg</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 font-mono">
                        <input
                          type="number"
                          value={currentEdit.points}
                          onChange={(e) =>
                            setEditableRules((prev) => ({
                              ...prev,
                              [rule.id]: {
                                ...currentEdit,
                                points: Math.max(0, parseInt(e.target.value) || 0)
                              }
                            }))
                          }
                          className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <span className="text-emerald-600 font-semibold dark:text-emerald-400">poin</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveRule(rule.id)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        Simpan Baris
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Margin Simulator (Interactive Feasibility Model) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Input Parameters (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Simulator Margin Sirkularitas
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Uji kelayakan unit ekonomi operasional bulanan berdasarkan target volume setoran.
          </p>

          <div className="mt-5 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Target Setoran Botol PET (unit/bulan)
              </label>
              <input
                type="number"
                step="500"
                value={simPetUnits}
                onChange={(e) => setSimPetUnits(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">~{estPetKg} kg massa terkumpul</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Target Setoran Kaleng Aluminium (unit/bulan)
              </label>
              <input
                type="number"
                step="500"
                value={simAluUnits}
                onChange={(e) => setSimAluUnits(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">~{estAluKg} kg massa terkumpul</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Biaya Operasional & Listrik Mesin (Rp/bulan)
              </label>
              <input
                type="number"
                step="50000"
                value={simOpsCost}
                onChange={(e) => setSimOpsCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">Daya listrik ~120W per unit + kuota IoT</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Sponsorship CSR / Mitra Sirkular (Rp/bulan)
              </label>
              <input
                type="number"
                step="100000"
                value={simCsrSupport}
                onChange={(e) => setSimCsrSupport(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">Dukungan dana program keberlanjutan</span>
            </div>
          </div>
        </div>

        {/* Right: Projected Economics Outcome (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Proyeksi Neraca Ekonomi Sirkular
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  netOperatingMargin >= 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                {netOperatingMargin >= 0 ? `Surplus +${marginPercentage}%` : `Defisit ${marginPercentage}%`}
              </span>
            </div>

            {/* Income Streams */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pemasukan Operasional:
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Penjualan PET ({estPetKg} kg @ Rp{petPricePerKg})</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  Rp {revenueScrapPet.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Penjualan Aluminium ({estAluKg} kg @ Rp{aluPricePerKg})</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  Rp {revenueScrapAlu.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Dukungan Mitra CSR Sirkularitas</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  Rp {simCsrSupport.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                <span>Total Arus Kas Masuk</span>
                <span className="font-mono">Rp {totalRevenue.toLocaleString('id-ID')}</span>
              </div>

              {/* Expense Streams */}
              <div className="mt-4 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Beban Liabilitas & Operasional:
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">
                  Liabilitas Poin Reward ({totalPointsIssued.toLocaleString('id-ID')} pts @ Rp10)
                </span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  (Rp {totalUserRewardPayoutRp.toLocaleString('id-ID')})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Beban Listrik, Kompresor & Kuota IoT</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  (Rp {simOpsCost.toLocaleString('id-ID')})
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 pt-1">
                <span>Total Beban Operasional</span>
                <span className="font-mono">(Rp {totalCost.toLocaleString('id-ID')})</span>
              </div>
            </div>
          </div>

          {/* Bottom Net Margin Result Card */}
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Net Operating Margin Mandiri:
                </span>
                <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  Rp {netOperatingMargin.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-normal">/bulan</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
              Sistem memiliki cadangan kas positif untuk reinvestasi armada RVM baru dan perawatan berkala.
            </p>
          </div>
        </div>
      </div>

      {/* Reward Items Catalog */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Katalog Reward Penukaran Poin Pengguna
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Item reward yang tampil di aplikasi pengguna untuk ditukarkan dengan poin hasil setoran.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {rewardItems.length} Item Tersedia
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rewardItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {item.pointsRequired} Poin
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Stok: <strong className="text-slate-800 dark:text-slate-200">{item.stock} unit</strong></span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Aktif di App
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
