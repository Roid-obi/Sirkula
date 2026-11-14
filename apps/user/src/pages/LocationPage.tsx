import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_MACHINES } from '@sirkula/api-client';
import { RvmMachine } from '@sirkula/shared-types';
import L from 'leaflet';
import {
  ArrowLeft,
  Search,
  MapPin,
  QrCode,
  Navigation,
  Compass,
  Layers,
  List,
  Map as MapIcon,
  X,
  Clock,
  Wifi,
  ChevronRight,
  ShieldCheck,
  Footprints
} from 'lucide-react';

const UNS_CENTER: [number, number] = [-7.5589, 110.8562];

const CURRENT_USER_LOCATION = {
  name: 'Lokasi Anda Saat Ini',
  zone: 'Boulevard Kampus Kentingan UNS',
  lat: -7.55872,
  lng: 110.85625
};

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedMachine, setSelectedMachine] = useState<RvmMachine | null>(MOCK_MACHINES[0]);
  const [showRoute, setShowRoute] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Filtered machines based on query and filter
  const filteredMachines = MOCK_MACHINES.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Initialize or re-center Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: UNS_CENTER,
        zoom: 16,
        zoomControl: false, // We place custom controls or bottom-right
        attributionControl: false
      });

      // Google Maps style crisp OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Current User Location Marker (Google Maps Style Pulsing Emerald Beacon)
      const userLocationIcon = L.divIcon({
        className: 'custom-user-location-pin',
        html: `
          <div class="user-current-location-marker">
            <div class="user-location-halo"></div>
            <div class="user-location-dot"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([CURRENT_USER_LOCATION.lat, CURRENT_USER_LOCATION.lng], { icon: userLocationIcon })
        .addTo(map)
        .bindTooltip(`<b>${CURRENT_USER_LOCATION.name}</b><br/>${CURRENT_USER_LOCATION.zone}`, {
          direction: 'top',
          offset: [0, -16]
        });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add Machine Markers
    filteredMachines.forEach((machine) => {
      const isSelected = selectedMachine?.id === machine.id;
      const statusClass =
        machine.status === 'online' ? 'online' : machine.status === 'warning' ? 'warning' : 'offline';

      const customPin = L.divIcon({
        className: 'custom-rvm-pin',
        html: `
          <div class="gmap-pin-container ${isSelected ? 'selected' : ''}">
            <div class="gmap-pin-badge ${statusClass}">
              <div class="gmap-pin-inner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <div class="gmap-pin-shadow"></div>
          </div>
        `,
        iconSize: [38, 48],
        iconAnchor: [19, 48]
      });

      const marker = L.marker([machine.lat, machine.lng], { icon: customPin })
        .addTo(map)
        .on('click', () => {
          setSelectedMachine(machine);
          setShowRoute(false);
          map.flyTo([machine.lat, machine.lng], 17, { duration: 0.8 });
        });

      markersRef.current[machine.id] = marker;
    });

    // Invalidate size after DOM mount
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [viewMode, filteredMachines, selectedMachine]);

  // Handle Draw Route
  const handleToggleRoute = () => {
    if (!mapInstanceRef.current || !selectedMachine) return;
    const map = mapInstanceRef.current;

    if (showRoute) {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      setShowRoute(false);
    } else {
      // Draw walking route line between Current User Location and selected machine
      const startPoint: [number, number] = [CURRENT_USER_LOCATION.lat, CURRENT_USER_LOCATION.lng];
      const endPoint: [number, number] = [selectedMachine.lat, selectedMachine.lng];

      // Subtle waypoint simulating campus walkway
      const midPoint: [number, number] = [
        (startPoint[0] + endPoint[0]) / 2 + 0.0003,
        (startPoint[1] + endPoint[1]) / 2 - 0.0002
      ];

      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }

      routePolylineRef.current = L.polyline([startPoint, midPoint, endPoint], {
        color: '#16A34A',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      map.fitBounds([startPoint, endPoint], { padding: [60, 60] });
      setShowRoute(true);
    }
  };

  const handleFocusMyLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([CURRENT_USER_LOCATION.lat, CURRENT_USER_LOCATION.lng], 17, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col bg-background overflow-hidden">
      {/* 1. Google Maps Floating Header Bar */}
      <div className="absolute top-0 inset-x-0 z-30 p-3 space-y-2 pointer-events-none">
        {/* Main Floating Search Pill */}
        <div className="pointer-events-auto bg-card border border-border rounded-2xl shadow-lg p-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/app')}
            className="w-9 h-9 rounded-xl bg-muted/60 hover:bg-muted flex items-center justify-center text-foreground transition shrink-0"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-2 px-1">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari RVM di Kampus UNS..."
              className="w-full bg-transparent text-xs text-foreground placeholder-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Map / List Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            {viewMode === 'map' ? (
              <>
                <List className="w-3.5 h-3.5" /> <span>Daftar</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5" /> <span>Peta</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Chips Floating Row */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 shadow-sm border ${
              filterStatus === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Semua ({MOCK_MACHINES.length})
          </button>
          <button
            onClick={() => setFilterStatus('online')}
            className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 shadow-sm border ${
              filterStatus === 'online'
                ? 'bg-emerald-600 text-white border-transparent'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1.5 rounded-full font-semibold transition shrink-0 shadow-sm border ${
              filterStatus === 'warning'
                ? 'bg-amber-600 text-white border-transparent'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            Hampir Penuh
          </button>
        </div>
      </div>

      {/* 2. Map Viewport (Google Maps Style) */}
      {viewMode === 'map' ? (
        <div className="relative flex-1 w-full h-full">
          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Action Button (Focus Lokasi Saya) */}
          <button
            onClick={handleFocusMyLocation}
            className="absolute right-3 bottom-52 z-20 w-11 h-11 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition"
            title="Fokus ke Lokasi Saya"
          >
            <Navigation className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
          </button>

          {/* 3. Google Maps Floating Place Card (Bottom Sheet Preview) */}
          {selectedMachine && (
            <div className="absolute inset-x-3 bottom-3 z-30">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedMachine.status === 'online'
                            ? 'bg-emerald-500'
                            : selectedMachine.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
                        {selectedMachine.id}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          selectedMachine.status === 'online'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {selectedMachine.statusLabel}
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-foreground">{selectedMachine.name}</h2>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> {selectedMachine.zone}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedMachine(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Operating Info Pills */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground bg-muted/40 p-2 rounded-xl border border-border">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> {selectedMachine.operatingHours || '07:30 - 20:00 WIB'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-primary" /> {selectedMachine.wifiRssi}
                  </span>
                  <span className="flex items-center gap-1 ml-auto text-emerald-600 font-bold">
                    <Footprints className="w-3 h-3" /> ~2 mnt
                  </span>
                </div>

                {/* Capacity Progress Bars */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-muted/30 p-2 rounded-xl border border-border/60">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Botol PET</span>
                      <strong className="font-mono text-foreground">
                        {selectedMachine.petCount}/{selectedMachine.petCap}
                      </strong>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${Math.round((selectedMachine.petCount / selectedMachine.petCap) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 p-2 rounded-xl border border-border/60">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Kaleng Aluminium</span>
                      <strong className="font-mono text-foreground">
                        {selectedMachine.aluCount}/{selectedMachine.aluCap}
                      </strong>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${Math.round((selectedMachine.aluCount / selectedMachine.aluCap) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/app/scan?machine=${selectedMachine.id}`}
                    className="flex-1 mobile-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm text-center"
                  >
                    <QrCode className="w-4 h-4" /> Setor di Sini
                  </Link>

                  <button
                    onClick={handleToggleRoute}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                      showRoute
                        ? 'bg-emerald-600 text-white border-transparent'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    <Navigation className="w-4 h-4" /> {showRoute ? 'Hapus Rute' : 'Rute'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 4. List View Mode (Google Maps Style Results) */
        <div className="flex-1 overflow-y-auto pt-24 p-4 space-y-3 pb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
            <span>Menampilkan {filteredMachines.length} Smart RVM</span>
            <span>Kampus Kentingan UNS</span>
          </div>

          {filteredMachines.map((m) => {
            const petPct = Math.round((m.petCount / m.petCap) * 100);
            const aluPct = Math.round((m.aluCount / m.aluCap) * 100);

            return (
              <div
                key={m.id}
                className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-xs hover:border-primary/40 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          m.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
                        {m.id}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          m.status === 'online'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {m.statusLabel}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground">{m.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> {m.zone}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMachine(m);
                      setViewMode('map');
                    }}
                    className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-primary text-xs font-semibold flex items-center gap-1"
                    title="Lihat di Peta"
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Operating details */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" /> {m.operatingHours || '07:30 - 20:00 WIB'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-muted-foreground" /> {m.wifiRssi}
                  </span>
                </div>

                {/* Capacity */}
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-0.5 text-[10px]">
                      <span>Wadah Botol PET ({m.petCount}/{m.petCap})</span>
                      <strong className={`font-mono ${petPct > 85 ? 'text-amber-600 font-bold' : 'text-foreground'}`}>
                        {petPct}%
                      </strong>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${petPct > 85 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${petPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-muted-foreground mb-0.5 text-[10px]">
                      <span>Wadah Kaleng Alu ({m.aluCount}/{m.aluCap})</span>
                      <strong className={`font-mono ${aluPct > 85 ? 'text-amber-600 font-bold' : 'text-foreground'}`}>
                        {aluPct}%
                      </strong>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${aluPct > 85 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${aluPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <Link
                  to={`/app/scan?machine=${m.id}`}
                  className="w-full mobile-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs text-center"
                >
                  <QrCode className="w-4 h-4" /> Buka Scanner Mesin Ini
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
