import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  X,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Transaction } from '@sirkula/shared-types';

export const TransactionsPage: React.FC = () => {
  const { transactions, simulateLiveTransaction, showToast } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
  const [materialFilter, setMaterialFilter] = useState<'all' | 'PET' | 'ALUMINUM' | 'UNKNOWN'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        tx.id.toLowerCase().includes(searchLower) ||
        (tx.userName?.toLowerCase() || '').includes(searchLower) ||
        (tx.userId?.toLowerCase() || '').includes(searchLower) ||
        (tx.machineName?.toLowerCase() || '').includes(searchLower);

      if (!matchesSearch) return false;

      // Status
      if (statusFilter === 'accepted' && tx.status !== 'ACCEPTED') return false;
      if (statusFilter === 'rejected' && tx.status !== 'REJECTED') return false;

      // Material
      if (materialFilter !== 'all' && tx.material !== materialFilter) return false;

      return true;
    });
  }, [transactions, searchTerm, statusFilter, materialFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCopyIdempotency = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    showToast('Disalin ke Clipboard', `Idempotency Key: ${key}`, 'info');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      showToast('Data Kosong', 'Tidak ada data untuk diekspor.', 'warning');
      return;
    }

    const headers = [
      'Transaction ID',
      'Session ID',
      'Timestamp',
      'User ID',
      'User Name',
      'Machine ID',
      'Machine Name',
      'Material',
      'Weight (g)',
      'Weight (kg)',
      'Status',
      'Reward Points',
      'AI Confidence',
      'Idempotency Key'
    ];

    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.sessionId,
      tx.timestamp,
      tx.userId,
      `"${tx.userName}"`,
      tx.machineId,
      `"${tx.machineName}"`,
      tx.material,
      tx.weightG,
      tx.weightKg,
      tx.status,
      tx.rewardPoints,
      tx.aiConfidence,
      tx.idempotencyKey
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sirkula_transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', `${filteredTransactions.length} transaksi diekspor ke format CSV.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Transaksi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log audit penyetoran kemasan dengan idempotency key, skor verifikasi AI, sensor beban, dan reward poin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={simulateLiveTransaction}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            <span>Simulasi Transaksi</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Container Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari ID, user, mesin..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">Semua Status</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>

            {/* Material Filter */}
            <select
              value={materialFilter}
              onChange={(e) => {
                setMaterialFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">Semua Material</option>
              <option value="PET">Botol Plastik PET</option>
              <option value="ALUMINUM">Kaleng Aluminium</option>
              <option value="UNKNOWN">Residu Ditolak</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{filteredTransactions.length}</span> transaksi
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">ID & Waktu</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Lokasi RVM</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Berat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    Tidak ada transaksi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-mono">
                      <div className="font-semibold text-slate-900 dark:text-white">{tx.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 dark:text-white">{tx.userName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{tx.userId}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {tx.machineName}
                    </td>

                    <td className="px-4 py-3">
                      {tx.material === 'PET' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Botol PET
                        </span>
                      )}
                      {tx.material === 'ALUMINUM' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          Aluminium
                        </span>
                      )}
                      {tx.material === 'UNKNOWN' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Ditolak
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                      {tx.weightG}g
                    </td>

                    <td className="px-4 py-3">
                      {tx.status === 'ACCEPTED' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Diterima
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                          <XCircle className="h-3 w-3" />
                          Ditolak
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {tx.status === 'ACCEPTED' ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          +{tx.rewardPoints} pts
                        </span>
                      ) : (
                        <span className="text-slate-400">0 pts</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">
            Klik baris mana pun untuk membuka audit 5 tahap verifikasi sensor.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Sebelumnya
            </button>
            <span className="font-mono text-slate-500">
              Halaman {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Verification Audit Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {selectedTx.id}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      selectedTx.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    }`}
                  >
                    {selectedTx.statusLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Sesi: {selectedTx.sessionId} · {selectedTx.userName} ({selectedTx.userId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
              {/* Idempotency Key Strip */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Idempotency Key (Anti-Duplikasi):</span>
                  <button
                    type="button"
                    onClick={() => handleCopyIdempotency(selectedTx.idempotencyKey || selectedTx.id)}
                    className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? 'Disalin' : 'Salin Key'}</span>
                  </button>
                </div>
                <div className="mt-1 font-mono text-xs text-slate-800 break-all dark:text-slate-200">
                  {selectedTx.idempotencyKey || selectedTx.id}
                </div>
              </div>

              {/* 5-Stage Verification Timeline */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rantai Verifikasi 5 Subsistem Sensor
                </h4>
                <div className="mt-4 space-y-4">
                  {/* Stage 1 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        1. Otentikasi QR Dinamis (ESP32-S3 Handshake)
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Sesi pengguna divalidasi via MQTT broker dalam tempo 120ms. Pintu feeder dibuka.
                      </p>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          selectedTx.verificationStages?.aiInspected
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {selectedTx.verificationStages?.aiInspected ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        2. Inferensi Visi Komputer Edge (MobileNetV3)
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Model: {selectedTx.modelVersion || 'SirkulaCV-MobileNetV3 v1.2'} · Keyakinan Klasifikasi:{' '}
                        <strong>{Math.round((selectedTx.aiConfidence || 0.95) * 100)}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          selectedTx.verificationStages?.weightValidated
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {selectedTx.verificationStages?.weightValidated ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        3. Validasi Berat & Anti-Cairan (Load Cell HX711)
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Hasil ukur: <strong>{selectedTx.weightG}g</strong>. Ambang kosong valid (10g - 35g).
                        {selectedTx.status === 'REJECTED' &&
                          ' Berat di luar batas ambang / sisa cairan terdeteksi!'}
                      </p>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          selectedTx.verificationStages?.actuatorConfirmed
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        4. Konfirmasi Sortir Flap Servo (MG996R)
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Kemasan dialihkan ke bin {selectedTx.material === 'PET' ? 'PET' : 'Aluminium'}. Sensor optik konfirmasi objek jatuh sempurna.
                      </p>
                    </div>
                  </div>

                  {/* Stage 5 */}
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          selectedTx.verificationStages?.ledgerRecorded
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {selectedTx.verificationStages?.ledgerRecorded ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        5. Pencatatan Ledger & Emisi Reward
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {selectedTx.status === 'ACCEPTED'
                          ? `Saldo reward +${selectedTx.rewardPoints} poin diterbitkan secara atomik ke akun pengguna.`
                          : 'Tidak ada reward yang diterbitkan (transaksi ditolak).'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
              >
                Tutup Detail Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
