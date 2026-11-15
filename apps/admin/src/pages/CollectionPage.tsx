import React, { useState } from 'react';
import {
  Truck,
  CalendarPlus,
  Package,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertTriangle,
  X,
  FileText,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { MaterialBatch } from '@sirkula/shared-types';

export const CollectionPage: React.FC = () => {
  const { machines, batches, showToast } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for creating a new batch pickup
  const [selectedMachineId, setSelectedMachineId] = useState(machines[0]?.id || '');
  const [selectedMaterial, setSelectedMaterial] = useState<'PET' | 'ALUMINUM'>('PET');
  const [destinationPartner, setDestinationPartner] = useState('Bank Sampah Induk Surakarta');
  const [notes, setNotes] = useState('Kemasan terpilah bersih siap kirim baler daur ulang');

  // Machines with >= 60% capacity needing pickup priority
  const priorityMachines = machines.filter(
    (m) =>
      Math.round((m.petCount / m.petCap) * 100) >= 60 ||
      Math.round((m.aluCount / m.aluCap) * 100) >= 60
  );

  const totalReadyPetKg = machines.reduce((acc, m) => acc + m.petKg, 0);
  const totalReadyAluKg = machines.reduce((acc, m) => acc + m.aluKg, 0);
  const deliveredBatchesCount = batches.filter((b) => b.status === 'DELIVERED').length;

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceMachine = machines.find((m) => m.id === selectedMachineId);
    if (!sourceMachine) return;

    const newBatchId = `BATCH-2026-${selectedMaterial}-${Math.floor(100 + Math.random() * 900)}`;
    const weightKg = selectedMaterial === 'PET' ? sourceMachine.petKg : sourceMachine.aluKg;
    const containerCount = selectedMaterial === 'PET' ? sourceMachine.petCount : sourceMachine.aluCount;

    showToast(
      'Jadwal Angkut Dibuat',
      `Tiket ${newBatchId} untuk ${sourceMachine.name} dikirimkan ke armada logistik.`,
      'success'
    );
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pengumpulan & Keterlacakan Logistik
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Penjadwalan pengosongan wadah mesin otomatis dan pencatatan rantai pasok material ke mitra daur ulang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Jadwalkan Pengangkutan</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wadah Perlu Angkut</span>
            <span className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {priorityMachines.length}{' '}
            <span className="text-xs font-normal text-slate-500">Unit</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Kapasitas terisi &ge; 60%</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Siap Angkut (PET)</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {totalReadyPetKg.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Botol plastik bersih terpilah</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Siap Angkut (Aluminium)</span>
            <span className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
            {totalReadyAluKg.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Kaleng siap press baler</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Batch Tersalurkan</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {batches.length}{' '}
            <span className="text-xs font-normal text-slate-500">Batch</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{deliveredBatchesCount} terverifikasi timbangan mitra</p>
        </div>
      </div>

      {/* Priority Pickup Queue */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Antrean Prioritas Pengosongan Wadah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unit RVM yang mendesak untuk dijemput sebelum sensor optik mengunci feeder setoran.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {priorityMachines.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-xs text-slate-500">
              Semua wadah mesin dalam kondisi aman (&lt;60% kapasitas).
            </div>
          ) : (
            priorityMachines.map((machine) => {
              const petPct = Math.round((machine.petCount / machine.petCap) * 100);
              const aluPct = Math.round((machine.aluCount / machine.aluCap) * 100);

              return (
                <div
                  key={machine.id}
                  className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 transition dark:border-amber-900/40 dark:bg-amber-950/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {machine.id}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Prioritas Tinggi
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {machine.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {machine.zone}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMachineId(machine.id);
                        setModalOpen(true);
                      }}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Tugaskan Pengosongan
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-amber-200/60 bg-white/70 p-2.5 dark:border-amber-900/30 dark:bg-slate-900/70">
                      <div className="text-slate-500">Wadah PET ({petPct}%)</div>
                      <div className="mt-0.5 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {machine.petCount} unit · {machine.petKg.toFixed(2)} kg
                      </div>
                    </div>

                    <div className="rounded-lg border border-amber-200/60 bg-white/70 p-2.5 dark:border-amber-900/30 dark:bg-slate-900/70">
                      <div className="text-slate-500">Wadah Kaleng ({aluPct}%)</div>
                      <div className="mt-0.5 font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
                        {machine.aluCount} unit · {machine.aluKg.toFixed(2)} kg
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Batch Traceability Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Riwayat Batch Penyaluran Material
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penyaluran fisik akumulasi kemasan ke mitra industri daur ulang dengan kode keterlacakan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">ID Batch & Jadwal</th>
                <th className="px-5 py-3">Mesin Sumber</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Massa Bersih</th>
                <th className="px-5 py-3">Mitra Penerima</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Nilai Estimasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {batches.map((batch) => {
                const estValue = batch.material === 'PET'
                  ? Math.round(batch.totalWeightKg * 3800)
                  : Math.round(batch.totalWeightKg * 14500);

                return (
                  <tr key={batch.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-mono">
                      <div className="font-semibold text-slate-900 dark:text-white">{batch.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(batch.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {batch.sourceMachineName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{batch.sourceMachineId}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      {batch.material === 'PET' ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Plastik PET
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          Kaleng Aluminium
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      {batch.totalWeightKg} kg{' '}
                      <span className="text-[10px] text-slate-400">({batch.containerCount} unit)</span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      {batch.destinationPartner}
                    </td>

                    <td className="px-5 py-3.5">
                      {batch.status === 'DELIVERED' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Tersampaikan
                        </span>
                      )}
                      {batch.status === 'SEALED' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <Clock className="h-3 w-3" />
                          Disegel Siap Angkut
                        </span>
                      )}
                      {batch.status === 'IN_TRANSIT' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          <Truck className="h-3 w-3" />
                          Dalam Perjalanan
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Rp {estValue.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Logistics Pickup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Jadwalkan Pengangkutan Wadah
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Pilih Mesin Sumber
                </label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.name} (PET: {m.petKg}kg, ALU: {m.aluKg}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Kategori Material yang Diambil
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial('PET')}
                    className={`rounded-lg border p-2.5 text-center font-medium transition ${
                      selectedMaterial === 'PET'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Botol Plastik PET
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial('ALUMINUM')}
                    className={`rounded-lg border p-2.5 text-center font-medium transition ${
                      selectedMaterial === 'ALUMINUM'
                        ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Kaleng Aluminium
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Mitra Industri Penerima
                </label>
                <select
                  value={destinationPartner}
                  onChange={(e) => setDestinationPartner(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Bank Sampah Induk Surakarta">Bank Sampah Induk Surakarta</option>
                  <option value="PT Solo Daur Ulang Mandiri">PT Solo Daur Ulang Mandiri</option>
                  <option value="Sentra Sirkular Jawa Tengah">Sentra Sirkular Jawa Tengah</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Catatan Pengiriman / Segel Fisik
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
                >
                  Konfirmasi Pengangkutan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
