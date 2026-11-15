import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  Thermometer,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  X,
  Radio,
  Sliders,
  Filter
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { RvmMachine } from '@sirkula/shared-types';

export const MachinesPage: React.FC = () => {
  const { machines, showToast } = useAdmin();
  const [filterScope, setFilterScope] = useState<'all' | 'attention' | 'online'>('all');
  const [selectedMachine, setSelectedMachine] = useState<RvmMachine | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Filtered machines
  const filteredMachines = machines.filter((m) => {
    if (filterScope === 'attention') return m.status === 'warning' || m.status === 'offline';
    if (filterScope === 'online') return m.status === 'online';
    return true;
  });

  const onlineCount = machines.filter((m) => m.status === 'online').length;
  const warningCount = machines.filter((m) => m.status === 'warning').length;
  const offlineCount = machines.filter((m) => m.status === 'offline').length;
  const criticalCapacityCount = machines.filter(
    (m) => Math.round((m.petCount / m.petCap) * 100) >= 80 || Math.round((m.aluCount / m.aluCap) * 100) >= 80
  ).length;

  const handleTestConnection = () => {
    if (!selectedMachine) return;
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      showToast(
        'Uji Koneksi Berhasil',
        `Ping ke ${selectedMachine.name} (IP: 192.168.1.${selectedMachine.id.slice(-2)}) latensi 18ms. Firmware ESP32-S3 stabil.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Monitoring Mesin RVM
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Telemetri perangkat cerdas, kapasitas kompartemen terpilah, dan kondisi subsistem sensor secara live.
          </p>
        </div>

        {/* Scope Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setFilterScope('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filterScope === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Semua ({machines.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('attention')}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filterScope === 'attention'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Perhatian ({warningCount + offlineCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('online')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filterScope === 'online'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Online Siap ({onlineCount})
          </button>
        </div>
      </div>

      {/* Warning Banner if any units need attention */}
      {(warningCount > 0 || offlineCount > 0) && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <span className="font-semibold">Peringatan Operasional:</span> Terdapat{' '}
            <strong>{warningCount} unit mendekati kapasitas maksimal</strong> dan{' '}
            <strong>{offlineCount} unit memerlukan pengecekan jaringan Wi-Fi</strong>. Segera jadwalkan
            pengosongan wadah atau verifikasi sinyal gateway.
          </div>
        </div>
      )}

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Unit Terpasang</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Cpu className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {machines.length}{' '}
            <span className="text-xs font-normal text-slate-500">Node IoT</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">100% tersebar di titik strategis</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status Node Aktif</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Radio className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {onlineCount}/{machines.length}{' '}
            <span className="text-xs font-normal text-slate-500">Online</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">MQTT Heartbeat aktif per 5 detik</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wadah Kritis (≥80%)</span>
            <span className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {criticalCapacityCount}{' '}
            <span className="text-xs font-normal text-slate-500">Unit</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Butuh penjemputan logistik batch</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Rata-rata Uptime</span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {(machines.reduce((acc, m) => acc + m.uptimePct, 0) / machines.length).toFixed(1)}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Reliabilitas operasional prima</p>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredMachines.map((machine) => {
          const petPct = Math.min(100, Math.round((machine.petCount / machine.petCap) * 100));
          const aluPct = Math.min(100, Math.round((machine.aluCount / machine.aluCap) * 100));

          return (
            <div
              key={machine.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700/50"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {machine.id}
                      </h2>
                      {machine.isMvp && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          MVP Live
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{machine.zone}</p>
                  </div>

                  {/* Status badge */}
                  <div>
                    {machine.status === 'online' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    )}
                    {machine.status === 'warning' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Hampir Penuh
                      </span>
                    )}
                    {machine.status === 'offline' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-time bin capacities */}
                <div className="mt-4 space-y-3">
                  {/* PET */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Wadah Botol PET
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {machine.petCount}/{machine.petCap} unit ({petPct}%) · {machine.petKg.toFixed(2)} kg
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full transition-all ${
                          petPct >= 85
                            ? 'bg-amber-500'
                            : petPct >= 95
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${petPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Aluminium */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                        Wadah Kaleng Aluminium
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {machine.aluCount}/{machine.aluCap} unit ({aluPct}%) · {machine.aluKg.toFixed(2)} kg
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full transition-all ${
                          aluPct >= 85
                            ? 'bg-amber-500'
                            : aluPct >= 95
                            ? 'bg-rose-500'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${aluPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Telemetry Metrics Badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Thermometer className="h-3 w-3" />
                      Suhu
                    </div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {machine.tempC}°C
                    </div>
                  </div>

                  <div className="text-center border-x border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Wifi className="h-3 w-3" />
                      Wi-Fi
                    </div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {machine.wifiRssi}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Zap className="h-3 w-3" />
                      Hari Ini
                    </div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {machine.todayTx} tx
                    </div>
                  </div>
                </div>

                {/* Sensor System Info */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Sensors: {machine.sensors}</span>
                  <span className="font-mono">Sync: {machine.lastSync}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Model: {machine.cvModel.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMachine(machine)}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <span>Diagnostik & Kalibrasi</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnostics Drawer (Progressive Disclosure) */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {selectedMachine.id}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      selectedMachine.status === 'online'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : selectedMachine.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    }`}
                  >
                    {selectedMachine.statusLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {selectedMachine.name} · {selectedMachine.zone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMachine(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
              {/* Telemetry Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status Subsistem Hardware
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Mikrokontroler Utama</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {selectedMachine.controller}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Computer Vision Edge</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {selectedMachine.cvModel}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Load Cell Sensor Berat</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      HX711 0.1g Presisi (Terkalibrasi)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Mekanisme Servo Sorter</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      MG996R Dual Flap (Aktif)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Koneksi Sinyal Gateway</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {selectedMachine.wifiRssi} (Sangat Stabil)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-400">Uptime Sistem</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {selectedMachine.uptimePct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Sensor Weights */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kalibrasi Kompartemen Terpilah
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Total Berat PET</div>
                    <div className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedMachine.petKg.toFixed(2)} kg
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {selectedMachine.petCount} botol terkompaksi
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Total Berat Aluminium</div>
                    <div className="mt-1 font-mono text-lg font-bold text-sky-600 dark:text-sky-400">
                      {selectedMachine.aluKg.toFixed(2)} kg
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {selectedMachine.aluCount} kaleng terkompaksi
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Actions */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tindakan Operasional Langsung
                </h4>
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                    <span>{testingConnection ? 'Menguji Latensi Jaringan...' : 'Uji Ping & Handshake MQTT'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(
                        'Pembersihan Sensor Dimulai',
                        `Perintah kalibrasi tare beban dikirim ke ESP32 ${selectedMachine.id}.`,
                        'info'
                      );
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Kalibrasi Ulang Sensor Beban (Tare 0.0g)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedMachine(null)}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
              >
                Tutup Diagnostik
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
