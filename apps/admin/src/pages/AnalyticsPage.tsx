import React, { useState } from 'react';
import {
  BarChart3,
  Layers,
  Leaf,
  Zap,
  Droplets,
  TreeDeciduous,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { MOCK_DAILY_TREND } from '../data/adminStore';

export const AnalyticsPage: React.FC = () => {
  const { kpis, machines, transactions } = useAdmin();
  const [metricType, setMetricType] = useState<'units' | 'kg'>('units');

  // Calculate environmental impacts
  const totalWeightKg = kpis.totalPetKg + kpis.totalAluKg;
  // PET saves ~1.5kg CO2 per kg recycled, Aluminium saves ~9kg CO2 per kg recycled
  const co2AvoidedKg = (kpis.totalPetKg * 1.5 + kpis.totalAluKg * 9.0).toFixed(1);
  const kwhSaved = (kpis.totalPetKg * 2.3 + kpis.totalAluKg * 14.0).toFixed(1);
  const oilSavedLiters = (kpis.totalPetKg * 1.2 + kpis.totalAluKg * 0.8).toFixed(1);
  const treeEquiv = (Number(co2AvoidedKg) / 21.7).toFixed(1);

  // Maximum value for chart scaling
  const maxVal = Math.max(
    ...MOCK_DAILY_TREND.map((d) => (metricType === 'units' ? d.petUnits + d.aluUnits : d.petKg + d.aluKg))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analitik Material & Dampak Lingkungan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Statistik akumulasi kemasan sirkular, kontribusi titik node RVM, dan konversi reduksi jejak karbon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMetricType('units')}
              className={`rounded-md px-3 py-1.5 transition ${
                metricType === 'units'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Jumlah Unit
            </button>
            <button
              type="button"
              onClick={() => setMetricType('kg')}
              className={`rounded-md px-3 py-1.5 transition ${
                metricType === 'kg'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Berat Massa (kg)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Analytical KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* PET */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Akumulasi Botol PET</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {kpis.totalPetUnits.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-500">unit</span>
          </div>
          <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Setara {kpis.totalPetKg} kg plastik daur ulang
          </p>
        </div>

        {/* Aluminium */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Akumulasi Kaleng Aluminium</span>
            <span className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {kpis.totalAluUnits.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-500">unit</span>
          </div>
          <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">
            Setara {kpis.totalAluKg} kg aluminium murni
          </p>
        </div>

        {/* Purity Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kemurnian Terpilah</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {kpis.cleanRecyclingRatePct}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Bebas kontaminasi cairan & residu</p>
        </div>

        {/* Carbon Offset */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Reduksi Emisi Karbon</span>
            <span className="rounded-md bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
              <Leaf className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
            {co2AvoidedKg} <span className="text-xs font-normal text-slate-500">kg CO2e</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Metrik standar EPA WARM 2026</p>
        </div>
      </div>

      {/* 14-Day Accumulation Trend Chart + Distribution Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Trend Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tren Akumulasi 14 Hari Terakhir
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peningkatan volume setoran botol PET dan kaleng aluminium per hari.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
                PET
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded bg-sky-500" />
                Aluminium
              </span>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="mt-6 flex h-60 items-end justify-between gap-2 pt-6">
            {MOCK_DAILY_TREND.map((point) => {
              const petHeight = metricType === 'units'
                ? Math.round((point.petUnits / maxVal) * 100)
                : Math.round((point.petKg / maxVal) * 100);
              const aluHeight = metricType === 'units'
                ? Math.round((point.aluUnits / maxVal) * 100)
                : Math.round((point.aluKg / maxVal) * 100);

              return (
                <div key={point.date} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-12 z-20 hidden -translate-x-1/2 rounded bg-slate-900 px-2.5 py-1 text-[11px] text-white shadow-lg group-hover:block whitespace-nowrap dark:bg-slate-800">
                    <span className="font-semibold">{point.label}:</span>{' '}
                    PET {metricType === 'units' ? `${point.petUnits} unit` : `${point.petKg} kg`} · ALU{' '}
                    {metricType === 'units' ? `${point.aluUnits} unit` : `${point.aluKg} kg`}
                  </div>

                  {/* Stacked bar */}
                  <div className="w-full max-w-[28px] flex flex-col items-stretch justify-end h-full">
                    {/* Aluminium (top) */}
                    <div
                      className="w-full rounded-t bg-sky-500 transition-all duration-300 group-hover:bg-sky-400"
                      style={{ height: `${aluHeight}%` }}
                    />
                    {/* PET (bottom) */}
                    <div
                      className="w-full bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
                      style={{ height: `${petHeight}%` }}
                    />
                  </div>

                  <span className="mt-2 text-[10px] text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                    {point.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Machine Distribution Breakdown (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Kontribusi per Node Mesin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total tonase material terkumpul dari tiap titik RVM.
          </p>

          <div className="mt-5 space-y-4">
            {machines.map((machine) => {
              const machineWeight = Number((machine.petKg + machine.aluKg).toFixed(2));
              const pctOfTotal = totalWeightKg > 0 ? Math.round((machineWeight / totalWeightKg) * 100) : 25;

              return (
                <div key={machine.id}>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {machine.id}
                      </span>{' '}
                      <span className="text-slate-500">· {machine.name}</span>
                    </div>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {machineWeight} kg ({pctOfTotal}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${pctOfTotal}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Insights:</span> Lokasi RVM-01 (Perpustakaan) menyumbang kontribusi terbesar yakni ~34% dari total setoran harian karena lalu lintas pejalan kaki yang padat.
          </div>
        </div>
      </div>

      {/* Environmental Equivalents & Rejection Analysis Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Rejection Reasons Table (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Rincian Penolakan Sensor Multi-Modal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencegahan kontaminasi kompartemen sebelum kemasan masuk ke wadah daur ulang.
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              Filter Aktif
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Kategori Pencegahan</th>
                  <th className="py-2.5 px-3">Sensor Deteksi</th>
                  <th className="py-2.5 px-3">Jumlah</th>
                  <th className="py-2.5 px-3 text-right">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    Botol berisi sisa cairan (&gt;35g)
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">Load Cell HX711</td>
                  <td className="py-2.5 px-3 font-mono font-medium">54 unit</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    42.2%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    Objek Non-Recyclable (Kertas/Mug/Batu)
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">MobileNetV3 AI</td>
                  <td className="py-2.5 px-3 font-mono font-medium">38 unit</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    29.7%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    Kaleng penyok ekstrem tanpa fitur visual
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">AI + Dimensi IR</td>
                  <td className="py-2.5 px-3 font-mono font-medium">21 unit</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    16.4%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    Timeout Pengambilan / Sesi Batal
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">Watchdog Feeder</td>
                  <td className="py-2.5 px-3 font-mono font-medium">15 unit</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    11.7%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Environmental Equivalents Cards (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Konversi Dampak Ekologis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekuivalensi jejak karbon riil dari material yang berhasil diselamatkan dari TPA.
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <TreeDeciduous className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {treeEquiv} Pohon
                </div>
                <div className="text-xs text-slate-500">
                  Setara bibit pohon yang tumbuh selama 10 tahun menyerap karbon
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {kwhSaved} kWh Listrik
                </div>
                <div className="text-xs text-slate-500">
                  Energi peleburan bijih virgin aluminium & minyak sintetis yang dihemat
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="rounded-lg bg-sky-100 p-2 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                <Droplets className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {oilSavedLiters} Liter Minyak Bumi
                </div>
                <div className="text-xs text-slate-500">
                  Konsumsi bahan bakar fosil mentah yang dieliminasi dari siklus produksi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
