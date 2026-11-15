import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Cpu,
  Wifi,
  Thermometer,
  Layers,
  Activity,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Navigation,
  ShieldCheck,
  Zap,
  Radio,
  Sliders
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { RvmMachine } from '@sirkula/shared-types';

const MAP_CENTER: [number, number] = [-7.5589, 110.8562];
const SERVER_CENTER: [number, number] = [-7.5592, 110.8558];

export const MapPage: React.FC = () => {
  const { machines, showToast, simulateLiveTransaction } = useAdmin();
  const [selectedMachine, setSelectedMachine] = useState<RvmMachine>(machines[0] || null);
  const [showTopology, setShowTopology] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      polylineLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Clear old topology polylines
    if (polylineLayerGroupRef.current) {
      polylineLayerGroupRef.current.clearLayers();
    }

    // Add Central Server Hub Marker
    const serverIcon = L.divIcon({
      className: 'custom-rvm-server-pin',
      html: `
        <div style="background:#0f172a; border:2px solid #10b981; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(16,185,129,0.5); color:#10b981;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker(SERVER_CENTER, { icon: serverIcon })
      .addTo(map)
      .bindTooltip('<b>Pusat Server & Gateway Broker MQTT</b><br/><span style="font-size:11px;color:#10b981;">Latensi Ingestion: 18ms</span>');

    // Add Machine Markers
    machines.forEach((machine) => {
      const isSelected = selectedMachine && selectedMachine.id === machine.id;

      const customIcon = L.divIcon({
        className: 'custom-rvm-live-pin',
        html: `
          <div class="rvm-live-marker ${isSelected ? 'selected' : ''}">
            <div class="rvm-live-pulse ${machine.status}"></div>
            <div class="rvm-live-dot ${machine.status}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([machine.lat, machine.lng], { icon: customIcon })
        .addTo(map)
        .bindTooltip(
          `<b>${machine.name}</b><br/><span style="font-size:11px;color:${
            machine.status === 'online' ? '#10B981' : machine.status === 'warning' ? '#F59E0B' : '#EF4444'
          }">● ${machine.statusLabel}</span>`,
          { direction: 'top', offset: [0, -14] }
        )
        .on('click', () => {
          setSelectedMachine(machine);
          map.flyTo([machine.lat, machine.lng], 17, { duration: 0.8 });
        });

      markersRef.current[machine.id] = marker;

      // Draw dashed network topology line to server
      if (showTopology && polylineLayerGroupRef.current) {
        const polyline = L.polyline([SERVER_CENTER, [machine.lat, machine.lng]], {
          color: machine.status === 'online' ? '#10b981' : machine.status === 'warning' ? '#f59e0b' : '#ef4444',
          weight: 2,
          opacity: 0.55,
          dashArray: '4, 8'
        });
        polylineLayerGroupRef.current.addLayer(polyline);
      }
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [machines, selectedMachine, showTopology]);

  const handleSelectNode = (m: RvmMachine) => {
    setSelectedMachine(m);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([m.lat, m.lng], 17, { duration: 0.8 });
    }
  };

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MAP_CENTER, 16, { duration: 0.8 });
    }
  };

  const onlineCount = machines.filter((m) => m.status === 'online').length;

  return (
    <div className="space-y-6">
      {/* Page Header with Live Telemetry Badges */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Stream · IoT Spatial Sensors
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Peta Sebaran & Kondisi Langsung Smart RVM
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visualisasi spasial interaktif terhubung langsung ke transmisi mikrokontroler ESP32-S3 di setiap unit.
          </p>
        </div>

        {/* Network Status HUD Card */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-white shadow-sm dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Status Jaringan
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-emerald-400">
              {onlineCount}/{machines.length} Node Terhubung
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Transmisi Ingestion</div>
            <div className="mt-0.5 font-mono text-xs font-semibold text-slate-200">
              18ms · MQTT QoS 1
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Side Inspector Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          {/* Map Floating Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTopology(!showTopology)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  showTopology
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                Topologi Jaringan ({showTopology ? 'Aktif' : 'Nonaktif'})
              </button>
              <button
                type="button"
                onClick={handleResetMap}
                className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Navigation className="h-3 w-3" />
                Pusatkan Peta
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online Siap
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Penuh &gt;80%
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Pemeliharaan
              </span>
            </div>
          </div>

          {/* Leaflet Canvas Container */}
          <div className="relative h-[520px] w-full">
            <div ref={mapContainerRef} className="h-full w-full z-0" />

            {/* Bottom Floating Legend */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-lg border border-slate-200/90 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-300">
              <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                ESP32-S3 MQTT Ingestion
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Latency: 18ms</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Machine Telemetry Inspector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {selectedMachine ? (
            <div className="space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {selectedMachine.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      selectedMachine.status === 'online'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : selectedMachine.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedMachine.status === 'online'
                          ? 'bg-emerald-500'
                          : selectedMachine.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    {selectedMachine.statusLabel}
                  </span>
                </div>
                <h3 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-white">
                  {selectedMachine.name}
                </h3>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {selectedMachine.zone}
                </p>
              </div>

              {/* Hardware Telemetry Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Thermometer className="h-3.5 w-3.5 text-slate-400" />
                    Suhu Mesin
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                    {selectedMachine.tempC}°C
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Suhu Normal</div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Wifi className="h-3.5 w-3.5 text-slate-400" />
                    Sinyal Wi-Fi
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                    {selectedMachine.wifiRssi}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Sangat Baik</div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Sliders className="h-3.5 w-3.5 text-slate-400" />
                    Load Cell
                  </div>
                  <div className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                    HX711 Kalibrasi
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Presisi 0.1g Aktif</div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    Visi AI (Kamera)
                  </div>
                  <div className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                    MobileNetV3
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Uptime: {selectedMachine.uptimePct}%</div>
                </div>
              </div>

              {/* Real-time Capacity Progress Meters */}
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/20">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Kapasitas Wadah Terkini:
                </div>

                {/* PET */}
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">Wadah Botol PET</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {selectedMachine.petCount}/{selectedMachine.petCap} unit ({Math.round((selectedMachine.petCount / selectedMachine.petCap) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{
                        width: `${Math.min(100, (selectedMachine.petCount / selectedMachine.petCap) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Aluminium */}
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">Wadah Kaleng Aluminium</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {selectedMachine.aluCount}/{selectedMachine.aluCap} unit ({Math.round((selectedMachine.aluCount / selectedMachine.aluCap) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-sky-500 transition-all"
                      style={{
                        width: `${Math.min(100, (selectedMachine.aluCount / selectedMachine.aluCap) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Transaksi Terakhir di Unit Ini:</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {selectedMachine.todayTx} tx hari ini
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-slate-500">
              Pilih salah satu pin mesin di peta untuk melihat telemetri.
            </div>
          )}

          {/* Interactive Trigger Button */}
          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={simulateLiveTransaction}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
            >
              <Zap className="h-4 w-4" />
              <span>Simulasikan Setoran Sensor di Unit Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Quick Node Selector Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {machines.map((machine) => {
          const isSelected = selectedMachine && selectedMachine.id === machine.id;
          const petPct = Math.round((machine.petCount / machine.petCap) * 100);

          return (
            <button
              key={machine.id}
              type="button"
              onClick={() => handleSelectNode(machine)}
              className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {machine.id}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    machine.status === 'online'
                      ? 'bg-emerald-500'
                      : machine.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1 dark:text-slate-200">
                {machine.name}
              </div>
              <div className="mt-2 flex w-full items-center justify-between text-[11px] text-slate-500">
                <span>PET: {petPct}%</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Pilih &gt;</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
