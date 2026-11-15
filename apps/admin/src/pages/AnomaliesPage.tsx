import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Check,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AnomalyEvent } from '@sirkula/shared-types';

export const AnomaliesPage: React.FC = () => {
  const { anomalies, resolveAnomaly, showToast } = useAdmin();
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'resolved'>('all');

  // Normalize status helper
  const getActionStatus = (a: any): 'Dibuka' | 'Diproses' | 'Selesai' => {
    if (a.actionStatus) return a.actionStatus;
    if (a.status === 'RESOLVED') return 'Selesai';
    if (a.status === 'INVESTIGATING') return 'Diproses';
    return 'Dibuka';
  };

  const filteredAnomalies = anomalies.filter((a) => {
    const status = getActionStatus(a);
    if (filterTab === 'open') return status === 'Dibuka' || status === 'Diproses';
    if (filterTab === 'resolved') return status === 'Selesai';
    return true;
  });

  const totalCount = anomalies.length;
  const openCount = anomalies.filter((a) => getActionStatus(a) !== 'Selesai').length;
  const resolvedCount = anomalies.filter((a) => getActionStatus(a) === 'Selesai').length;

  const handleStatusChange = (id: string, newStatus: 'Dibuka' | 'Diproses' | 'Selesai') => {
    resolveAnomaly(id, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Deteksi Anomali & Anti-Fraud
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log mitigasi manipulasi penyetoran, deteksi cairan berlebih, proteksi ledger reward, dan keandalan sistem.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('open')}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filterTab === 'open'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Perlu Tindakan ({openCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('resolved')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filterTab === 'resolved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Selesai Ditangani ({resolvedCount})
          </button>
        </div>
      </div>

      {/* 3 Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Kejadian Terdeteksi</span>
            <span className="rounded-md bg-slate-100 p-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {totalCount}{' '}
            <span className="text-xs font-normal text-slate-500">Insiden</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Tercatat secara atomik di log sensor</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Butuh Tindakan Segera</span>
            <span className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {openCount}{' '}
            <span className="text-xs font-normal text-slate-500">Menunggu</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Pemeriksaan fisik atau pembersihan bin</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Berhasil Dimitiagasi</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {resolvedCount}{' '}
            <span className="text-xs font-normal text-slate-500">Selesai</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">100% residu dialihkan ke pintu reject</p>
        </div>
      </div>

      {/* Anomaly Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Log Mitigasi Risiko & Sensor Proteksi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penyimpangan fisik dan anomali sinyal yang terdeteksi sebelum proses pencatatan poin dilakukan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">ID & Waktu</th>
                <th className="px-5 py-3">Tingkat</th>
                <th className="px-5 py-3">Jenis Anomali & Deskripsi</th>
                <th className="px-5 py-3">Mesin Sumber</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Tindakan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAnomalies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    Tidak ada log anomali untuk filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredAnomalies.map((anom) => {
                  const actionStatus = getActionStatus(anom);

                  return (
                    <tr key={anom.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4 font-mono">
                        <div className="font-semibold text-slate-900 dark:text-white">{anom.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(anom.occurredAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {anom.severity === 'CRITICAL' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            Kritis
                          </span>
                        )}
                        {anom.severity === 'HIGH' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                            Tinggi
                          </span>
                        )}
                        {anom.severity === 'MEDIUM' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            Sedang
                          </span>
                        )}
                        {anom.severity === 'LOW' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Rendah
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-sm">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {anom.type}
                        </div>
                        <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          {anom.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {anom.machineName}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{anom.machineId}</div>
                      </td>

                      <td className="px-5 py-4">
                        {actionStatus === 'Selesai' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Selesai
                          </span>
                        )}
                        {actionStatus === 'Diproses' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <Clock className="h-3 w-3" />
                            Diproses
                          </span>
                        )}
                        {actionStatus === 'Dibuka' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                            <AlertTriangle className="h-3 w-3" />
                            Dibuka
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {actionStatus !== 'Selesai' ? (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(anom.id, 'Selesai')}
                              className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                              Tandai Selesai
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(anom.id, 'Dibuka')}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              Buka Kembali
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
