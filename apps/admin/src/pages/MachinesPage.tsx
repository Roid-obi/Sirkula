import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import {
  Wifi,
  Package,
  Boxes,
  Activity,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { RvmMachine } from '@sirkula/shared-types';

const CENTRAL_HUB = {
  id: 'HUB-UNS-HQ',
  name: 'Pusat Kendali Sirkula & Server IoT',
  zone: 'Gedung Rektorat dr. Prakosa UNS',
  lat: -7.55872,
  lng: 110.85625,
  ip: '10.200.0.1',
  status: 'online',
  statusLabel: 'Pusat Aktif',
  role: 'Central Ingestion Gateway & Broker'
};

const UNS_CENTER: [number, number] = [-7.5589, 110.8562];
const DEFAULT_ZOOM = 16;

export const MachinesPage: React.FC = () => {
  const { machines, theme, showToast } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlView = searchParams.get('view');
  const [activeView, setActiveView] = useState<'map' | 'grid'>(
    urlView === 'grid' ? 'grid' : 'map'
  );
  const [activeScope, setActiveScope] = useState<'all' | 'attention'>('all');
  const [selectedMachine, setSelectedMachine] = useState<RvmMachine | null>(null);
  const [showTopology, setShowTopology] = useState<boolean>(true);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const networkLinesRef = useRef<L.Polyline[]>([]);

  // Update view when URL query param changes
  useEffect(() => {
    if (urlView === 'grid' && activeView !== 'grid') {
      setActiveView('grid');
    } else if (urlView === 'map' && activeView !== 'map') {
      setActiveView('map');
    }
  }, [urlView]);

  const handleSetView = (view: 'map' | 'grid') => {
    setActiveView(view);
    setSearchParams({ view });
  };

  // Filtering
  const filteredMachines = machines.filter((m) => {
    if (activeScope === 'attention') return m.status !== 'online';
    return true;
  });

  const onlineCount = machines.filter((m) => m.status !== 'offline').length;
  const totalPetKg = machines.reduce((acc, m) => acc + m.petKg, 0);
  const totalAluKg = machines.reduce((acc, m) => acc + m.aluKg, 0);
  const avgUptime = (
    machines.reduce((acc, m) => acc + m.uptimePct, 0) / machines.length
  )
    .toFixed(1)
    .replace('.', ',');

  const formatKg = (num: number) => {
    return Number(num).toFixed(2).replace('.', ',') + ' kg';
  };

  // Status badge helper matching duitin-sampah-hackathon
  const getBadge = (status: string, label: string) => {
    if (status === 'online') {
      return (
        <span className="badge badge-success">
          <span className="badge-dot" />
          {label}
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="badge badge-warning">
          <span className="badge-dot" />
          {label}
        </span>
      );
    }
    return (
      <span className="badge badge-destructive">
        <span className="badge-dot" />
        {label}
      </span>
    );
  };

  // Leaflet Marker Icon Generators matching duitin-sampah-hackathon/assets/js/pages/peta.js
  const createMarkerIcon = (status: string, isHub = false) => {
    if (isHub) {
      return L.divIcon({
        className: 'custom-rvm-icon',
        html: `
          <div class="rvm-marker-wrap hub" title="${CENTRAL_HUB.name}">
            <div class="rvm-pulse-ring"></div>
            <div class="rvm-node-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });
    }

    return L.divIcon({
      className: 'custom-rvm-icon',
      html: `
        <div class="rvm-marker-wrap ${status}">
          <div class="rvm-pulse-ring"></div>
          <div class="rvm-node-core">
            <span class="rvm-node-dot"></span>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18]
    });
  };

  // Map Tile URL
  const getTileConfig = (dark: boolean) => {
    if (dark) {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, OpenStreetMap contributors',
        maxZoom: 18
      };
    }
    return {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19
    };
  };

  // Initialize and update Map with clean lifecycle management
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Clean up any existing map instance to avoid container reuse errors
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const map = L.map(container, {
      center: UNS_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;

    // Set TileLayer
    const tileConfig = getTileConfig(theme === 'dark');
    L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);

    // Reset markers and lines
    markersRef.current = {};
    networkLinesRef.current = [];

    // 1. Central Hub Marker
    const hubMarker = L.marker([CENTRAL_HUB.lat, CENTRAL_HUB.lng], {
      icon: createMarkerIcon('online', true),
      zIndexOffset: 1000
    }).addTo(map);

    hubMarker.bindPopup(
      `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <div>
              <div class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${CENTRAL_HUB.id}</div>
              <div class="map-popup-title">${CENTRAL_HUB.name}</div>
              <div class="map-popup-zone">${CENTRAL_HUB.zone}</div>
            </div>
            <span class="badge badge-success">Pusat Server</span>
          </div>
          <p class="text-xs text-muted" style="margin-top:0.35rem;">
            Server gateway MQTT &amp; ingestion telemetri seluruh RVM Kampus UNS.
          </p>
        </div>
      `,
      { maxWidth: 300 }
    );
    markersRef.current[CENTRAL_HUB.id] = hubMarker;

    // 2. Machine Markers
    filteredMachines.forEach((m) => {
      const totalCount = m.petCount + m.aluCount;
      const totalCap = m.petCap + m.aluCap;
      const totalPct = Math.round((totalCount / totalCap) * 100);

      let badgeClass = 'badge-success';
      if (m.status === 'warning') badgeClass = 'badge-warning';
      if (m.status === 'offline') badgeClass = 'badge-destructive';

      const marker = L.marker([m.lat, m.lng], {
        icon: createMarkerIcon(m.status, false)
      }).addTo(map);

      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <div>
              <div class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${m.id}</div>
              <div class="map-popup-title">${m.name}</div>
              <div class="map-popup-zone">${m.zone}</div>
            </div>
            <span class="badge ${badgeClass}">${m.statusLabel}</span>
          </div>

          <div style="margin:0.75rem 0;">
            <div class="row-between text-xs" style="margin-bottom:0.35rem;">
              <span class="text-muted">Kapasitas Wadah</span>
              <span class="mono font-semibold">${totalPct}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}" style="width:${totalPct}%"></div>
            </div>
            <div class="row-between text-xs text-muted mono" style="margin-top:0.35rem;">
              <span>${m.petCount} PET · ${m.aluCount} Alu</span>
              <span>${totalCount}/${totalCap} unit</span>
            </div>
          </div>

          <div class="map-popup-footer">
            <span class="text-xs text-muted mono">${m.wifiRssi ? m.wifiRssi.split(' ')[0] : '-'}</span>
            <button type="button" class="btn btn-outline btn-sm popup-diag-btn" data-id="${m.id}" style="font-size:0.75rem;padding:0.25rem 0.55rem;">
              Diagnostik
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('popupopen', () => {
        const btn = document.querySelector(`.popup-diag-btn[data-id="${m.id}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            setSelectedMachine(m);
            marker.closePopup();
          });
        }
      });

      markersRef.current[m.id] = marker;
    });

    // 3. Topology Lines
    if (showTopology) {
      filteredMachines.forEach((m) => {
        let lineColor = '#16a34a';
        let lineClass = 'net-line-pulse';
        let opacity = 0.75;
        let dashArray = '6, 6';

        if (m.status === 'warning') {
          lineColor = '#d97706';
        } else if (m.status === 'offline') {
          lineColor = '#dc2626';
          lineClass = '';
          opacity = 0.35;
          dashArray = '3, 6';
        }

        const poly = L.polyline(
          [
            [CENTRAL_HUB.lat, CENTRAL_HUB.lng],
            [m.lat, m.lng]
          ],
          {
            color: lineColor,
            weight: m.status === 'offline' ? 1.5 : 2.5,
            opacity,
            dashArray,
            className: lineClass
          }
        ).addTo(map);

        networkLinesRef.current.push(poly);
      });
    }

    // Invalidate map size to ensure proper layout
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [theme, showTopology, activeScope]);

  // When switching views, trigger invalidateSize on the existing map
  useEffect(() => {
    if (activeView === 'map' && mapInstanceRef.current) {
      const t1 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 50);
      const t2 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [activeView]);

  // Focus map back to center
  const focusUns = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(UNS_CENTER, DEFAULT_ZOOM, { duration: 0.6 });
    }
  };

  const handlePing = () => {
    if (!selectedMachine) return;
    if (selectedMachine.status === 'offline') {
      showToast(
        `Ping ${selectedMachine.id} Timeout`,
        'Unit belum merespons. Buffer lokal aman.',
        'warning'
      );
    } else {
      showToast(
        `Heartbeat ${selectedMachine.id} Normal`,
        'Respons HTTP 200 OK diterima dalam 28 ms.',
        'success'
      );
    }
  };

  return (
    <>
      {/* Page Header matching duitin-sampah-hackathon */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Monitoring Mesin</h1>
          <p className="page-description">
            Status operasional unit RVM, kapasitas wadah terpilah, dan sebaran jaringan IoT Kampus UNS.
          </p>
        </div>
        <div className="page-actions">
          {/* View Mode Switch: Grid vs Map */}
          <div className="tabs-list" id="machine-view-tabs">
            <button
              type="button"
              className={`tab-trigger ${activeView === 'map' ? 'active' : ''}`}
              onClick={() => handleSetView('map')}
            >
              Peta Sebaran
            </button>
            <button
              type="button"
              className={`tab-trigger ${activeView === 'grid' ? 'active' : ''}`}
              onClick={() => handleSetView('grid')}
            >
              Kartu Unit
            </button>
          </div>

          {/* Scope Filter Tabs */}
          <div className="tabs-list" id="machine-scope-tabs">
            <button
              type="button"
              className={`tab-trigger ${activeScope === 'all' ? 'active' : ''}`}
              onClick={() => setActiveScope('all')}
            >
              Semua ({machines.length})
            </button>
            <button
              type="button"
              className={`tab-trigger ${activeScope === 'attention' ? 'active' : ''}`}
              onClick={() => setActiveScope('attention')}
            >
              Perhatian ({machines.filter((m) => m.status !== 'online').length})
            </button>
          </div>
        </div>
      </div>

      {/* Clean Operational Alert */}
      <div
        className="alert alert-warning"
        id="machine-alert-banner"
        style={{ padding: '0.6rem 0.85rem', marginBottom: '1.25rem' }}
      >
        <div className="text-xs">
          <strong>RVM-UNS-02</strong> kapasitas PET 89% (jadwal angkut sore) ·{' '}
          <strong>RVM-UNS-04</strong> sinyal Wi-Fi terputus.
        </div>
      </div>

      {/* Summary Strip (4 Clean KPIs) */}
      <section className="grid-kpi" id="machine-kpi-strip">
        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Konektivitas Unit</span>
            <span className="kpi-icon">
              <Wifi size={15} />
            </span>
          </div>
          <div className="kpi-value">
            {onlineCount} / {machines.length}{' '}
            <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              aktif
            </span>
          </div>
          <div className="kpi-sub">
            <span>
              {onlineCount} Online · {machines.length - onlineCount} Offline
            </span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Muatan Wadah PET</span>
            <span className="kpi-icon">
              <Package size={15} />
            </span>
          </div>
          <div className="kpi-value">{formatKg(totalPetKg)}</div>
          <div className="kpi-sub">
            <span>472 / 800 botol</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Muatan Wadah Aluminium</span>
            <span className="kpi-icon">
              <Boxes size={15} />
            </span>
          </div>
          <div className="kpi-value">{formatKg(totalAluKg)}</div>
          <div className="kpi-sub">
            <span>330 / 600 kaleng</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Rata-Rata Uptime</span>
            <span className="kpi-icon">
              <Activity size={15} />
            </span>
          </div>
          <div className="kpi-value">{avgUptime}%</div>
          <div className="kpi-sub">
            <span>Heartbeat berkala</span>
          </div>
        </div>
      </section>

      {/* View 1: Machine Cards Grid (Persisted in DOM, toggled via display) */}
      <section
        className="grid-2"
        id="machine-cards-grid"
        style={{
          display: activeView === 'grid' ? 'grid' : 'none',
          marginTop: '0.5rem',
          gridTemplateColumns: filteredMachines.length === 1 ? 'minmax(0, 760px)' : ''
        }}
      >
        {filteredMachines.map((m) => {
          const totalCount = m.petCount + m.aluCount;
          const totalCap = m.petCap + m.aluCap;
          const totalPct = Math.round((totalCount / totalCap) * 100);
          const pingText = m.wifiRssi ? '18 ms' : 'RTO';
          const signalText =
            m.status === 'offline' ? 'Terputus' : `${m.wifiRssi ? m.wifiRssi.split(' ')[0] : '-'} dBm`;

          return (
            <article key={m.id} className="card">
              <div className="card-header">
                <div>
                  <div className="row-gap-sm">
                    <span
                      className="mono text-xs font-semibold"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      {m.id}
                    </span>
                  </div>
                  <h2 className="card-title" style={{ fontSize: '1.05rem', marginTop: '0.25rem' }}>
                    {m.name}
                  </h2>
                  <p className="card-description">{m.zone}</p>
                </div>
                {getBadge(m.status, m.statusLabel)}
              </div>

              <div className="card-content stack" style={{ gap: '0.75rem' }}>
                {/* Unified Storage Meter */}
                <div
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'hsl(var(--muted)/0.4)',
                    border: '1px solid hsl(var(--border))'
                  }}
                >
                  <div className="row-between text-xs" style={{ marginBottom: '0.35rem' }}>
                    <span className="font-medium">Kapasitas Wadah</span>
                    <span className="mono font-semibold">
                      {totalPct}% ({totalCount}/{totalCap} unit)
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className={`progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}`}
                      style={{ width: `${totalPct}%` }}
                    />
                  </div>
                  <div
                    className="row-between text-xs text-muted mono"
                    style={{ marginTop: '0.35rem' }}
                  >
                    <span>
                      PET: {m.petCount}/{m.petCap}
                    </span>
                    <span>
                      Alu: {m.aluCount}/{m.aluCap}
                    </span>
                  </div>
                </div>

                {/* Status Line */}
                <div
                  className="row-between text-xs mono text-muted"
                  style={{ padding: '0.2rem' }}
                >
                  <span>
                    Ping: <strong>{pingText}</strong>
                  </span>
                  <span>
                    Sinyal: <strong>{signalText}</strong>
                  </span>
                  <span>
                    Hari Ini: <strong>{m.todayTx} tx</strong>
                  </span>
                  <span>
                    Suhu: <strong>{m.tempC}°C</strong>
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <span className="text-xs text-muted mono">{m.lastSync}</span>
                <div className="row-gap-sm">
                  {m.status === 'warning' && (
                    <NavLink to="/pengumpulan" className="btn btn-outline btn-sm">
                      Jadwal Angkut
                    </NavLink>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedMachine(m)}
                  >
                    Diagnostik
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* View 2: Integrated Interactive Map (Persisted in DOM, toggled via display) */}
      <section
        id="machine-map-section"
        style={{
          display: activeView === 'map' ? 'block' : 'none',
          marginTop: '0.5rem'
        }}
      >
        <div className="map-card-wrapper">
          <div className="map-toolbar-floating">
            <button
              type="button"
              className={`btn btn-outline btn-sm ${showTopology ? 'active' : ''}`}
              id="btn-toggle-topology"
              onClick={() => setShowTopology(!showTopology)}
            >
              Topologi Jaringan
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              id="btn-focus-uns"
              onClick={focusUns}
            >
              Fokus UNS
            </button>
          </div>

          <div
            id="machine-map-canvas"
            ref={mapContainerRef}
            className="map-container"
            style={{ height: '520px', width: '100%' }}
          />

          <div className="map-legend-floating">
            <div className="map-legend-item">
              <span className="badge-dot" style={{ color: 'hsl(var(--foreground))' }} />
              Pusat Server
            </div>
            <div className="map-legend-item">
              <span className="badge-dot" style={{ color: 'hsl(var(--primary))' }} />
              Online
            </div>
            <div className="map-legend-item">
              <span className="badge-dot" style={{ color: 'hsl(var(--warning))' }} />
              Hampir Penuh
            </div>
            <div className="map-legend-item">
              <span className="badge-dot" style={{ color: 'hsl(var(--destructive))' }} />
              Offline
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Diagnostics Sheet (Progressive Disclosure) matching duitin-sampah-hackathon */}
      {selectedMachine && (
        <>
          <div
            className="sheet-backdrop open"
            id="diag-backdrop"
            onClick={() => setSelectedMachine(null)}
          />
          <aside className="sheet-panel open" id="diag-panel" aria-hidden="false">
            <div className="sheet-header">
              <div>
                <div className="row-gap-sm">
                  <h3 className="card-title mono" id="diag-id">
                    {selectedMachine.id} — {selectedMachine.name}
                  </h3>
                  <span id="diag-badge">
                    {getBadge(selectedMachine.status, selectedMachine.statusLabel)}
                  </span>
                </div>
                <p className="card-description" id="diag-loc">
                  {selectedMachine.zone}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                id="btn-close-diag"
                aria-label="Tutup"
                onClick={() => setSelectedMachine(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="sheet-body" id="diag-body">
              <div className="label" style={{ marginBottom: '0.5rem' }}>
                Status Sub-Modul Hardware
              </div>
              <div className="kv-list">
                <div className="kv-row">
                  <span className="kv-key">A. Input Section</span>
                  <span className="badge badge-success">Normal · IR Aktif</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">B. Modul Kamera</span>
                  <span className="mono text-xs">OV2640 · {selectedMachine.cvModel}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">C. Sensor Berat</span>
                  <span className="mono text-xs">
                    Load Cell HX711 (Akurasi Tinggi · Kalibrasi Normal)
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">D. Pemrosesan</span>
                  <span className="mono text-xs">
                    {selectedMachine.controller} · {selectedMachine.tempC}°C
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">E. Servo Pemilah</span>
                  <span className="text-xs">2 Arah (PET / Alu)</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">F. Wadah Penyimpanan</span>
                  <span
                    className={`badge ${
                      selectedMachine.status === 'warning' ? 'badge-warning' : 'badge-success'
                    }`}
                  >
                    PET {selectedMachine.petCount}/{selectedMachine.petCap} · Alu{' '}
                    {selectedMachine.aluCount}/{selectedMachine.aluCap}
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">G. Jaringan &amp; IP</span>
                  <span
                    className={`mono text-xs ${
                      selectedMachine.status === 'offline' ? 'text-danger' : 'text-success'
                    }`}
                  >
                    {selectedMachine.wifiRssi || 'Stabil'}
                  </span>
                </div>
              </div>
            </div>

            <div className="sheet-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                id="btn-ping-diag"
                onClick={handlePing}
              >
                Uji Koneksi API
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                id="btn-close-diag-footer"
                onClick={() => setSelectedMachine(null)}
              >
                Selesai
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
