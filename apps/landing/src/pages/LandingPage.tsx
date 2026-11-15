import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  QrCode,
  Cpu,
  Scale,
  ShieldCheck,
  Recycle,
  Boxes,
  ArrowRight,
  Smartphone,
  MapPin,
  Coins,
  CheckCircle2,
  Sparkles,
  Wifi,
  Clock,
  Activity,
  Award,
  Leaf,
  TrendingUp,
  Compass,
  Radio,
  Thermometer,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  LayoutDashboard
} from 'lucide-react';

interface LiveRvmNode {
  id: string;
  code: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: 'online' | 'warning' | 'offline';
  statusLabel: string;
  petPercent: number;
  aluPercent: number;
  hours: string;
}

const USER_APP_URL = (import.meta.env.VITE_USER_APP_URL as string) || 'https://user-mobile-sirkula.vercel.app';
const ADMIN_APP_URL = (import.meta.env.VITE_ADMIN_APP_URL as string) || 'https://admin-sirkula.vercel.app';

const LIVE_MACHINES: LiveRvmNode[] = [
  {
    id: 'RVM-01',
    code: 'RVM-01',
    name: 'Perpustakaan & Ruang Publik',
    location: 'Lobby Utama Lantai 1',
    lat: -7.55835,
    lng: 110.85602,
    status: 'online',
    statusLabel: 'Siap Digunakan',
    petPercent: 68,
    aluPercent: 52,
    hours: '07:30 - 20:00 WIB'
  },
  {
    id: 'RVM-02',
    code: 'RVM-02',
    name: 'Koridor Layanan Publik Sains',
    location: 'Gedung Sains & Koridor Pejalan Kaki',
    lat: -7.55985,
    lng: 110.85420,
    status: 'warning',
    statusLabel: 'Kapasitas Penuh (89%)',
    petPercent: 89,
    aluPercent: 76,
    hours: '08:00 - 18:00 WIB'
  },
  {
    id: 'RVM-03',
    code: 'RVM-03',
    name: 'Pusat Layanan Terpadu & Informasi',
    location: 'Lobby Ruang Tunggu Pelayanan',
    lat: -7.55670,
    lng: 110.85510,
    status: 'online',
    statusLabel: 'Siap Digunakan',
    petPercent: 46,
    aluPercent: 29,
    hours: '07:30 - 17:00 WIB'
  },
  {
    id: 'RVM-04',
    code: 'RVM-04',
    name: 'Kawasan Sentra Komersial & Vokasi',
    location: 'Pintu Masuk Sentra Komersial',
    lat: -7.56120,
    lng: 110.85840,
    status: 'offline',
    statusLabel: 'Pemeliharaan Rutin',
    petPercent: 21,
    aluPercent: 18,
    hours: '08:00 - 17:00 WIB'
  }
];

const MAP_CENTER: [number, number] = [-7.5589, 110.8562];

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'machine' | 'impact'>('app');
  const [selectedMachine, setSelectedMachine] = useState<LiveRvmNode>(LIVE_MACHINES[0]);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Initialize Leaflet Live Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Crisp OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Create custom live radar pulse markers
    LIVE_MACHINES.forEach((machine) => {
      const isSelected = selectedMachine.id === machine.id;

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
            machine.status === 'online' ? '#16A34A' : machine.status === 'warning' ? '#D97706' : '#DC2626'
          }">● ${machine.statusLabel}</span>`,
          { direction: 'top', offset: [0, -14] }
        )
        .on('click', () => {
          setSelectedMachine(machine);
          map.flyTo([machine.lat, machine.lng], 17, { duration: 0.8 });
        });

      markersRef.current[machine.id] = marker;
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [selectedMachine]);

  const handleSelectNode = (machine: LiveRvmNode) => {
    setSelectedMachine(machine);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([machine.lat, machine.lng], 17, { duration: 0.8 });
    }
  };

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MAP_CENTER, 16, { duration: 0.8 });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Top Announcement Header Strip */}
      <div className="bg-slate-950 text-emerald-400 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold tracking-wider text-[11px] uppercase text-emerald-300">
              Sirkula Intelligence
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              Platform Pemulihan &amp; Keterlacakan Kemasan Minuman Berbasis AIoT
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80">
              Ekosistem Terbuka
            </span>
            <span>Untuk Seluruh Masyarakat &amp; Publik</span>
          </div>
        </div>
      </div>

      {/* 2. Sticky Navbar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Sirkula Logo" className="w-10 h-10 rounded-2xl shadow-sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-950">SIRKULA</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  AIoT
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block -mt-0.5">
                Material Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#solusi" className="hover:text-emerald-700 transition">Solusi</a>
            <a href="#fitur" className="hover:text-emerald-700 transition">Fitur Unggulan</a>
            <a href="#cara-kerja" className="hover:text-emerald-700 transition">Cara Kerja</a>
            <a href="#lokasi" className="hover:text-emerald-700 transition flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Map RVM
            </a>
            <a href="#faq" className="hover:text-emerald-700 transition">FAQ</a>
          </nav>

          {/* User App Action CTA */}
          <div className="flex items-center gap-2">
            <a
              href={USER_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mulai Setor Kemasan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Kecerdasan Buatan &amp; IoT untuk Pemulihan Kemasan Minuman Bersih</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Ubah Kemasan Minuman Bekas Menjadi <span className="text-emerald-700">Reward Digital</span> Bernilai Nyata.
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SIRKULA mentransformasikan proses daur ulang melalui <strong>Smart Reverse Vending Machine (RVM)</strong> yang dilengkapi Computer Vision dan sensor timbangan presisi. Cukup masukkan botol PET atau kaleng kosong, dan dapatkan poin hadiah seketika langsung ke ponsel Anda.
          </p>

          {/* Clean User CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href={USER_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" /> Buka Aplikasi Web Pengguna
            </a>
            <a
              href="#lokasi"
              className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-6 py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Radio className="w-4 h-4 text-emerald-600" /> Pantau Live Telemetri Mesin
            </a>
          </div>

          {/* 4 Metric Value Proposition Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-8 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">100% Bersih</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Pemilahan Otomatis</span>
              <span className="text-[11px] text-slate-500">Bebas kontaminasi sampah lain</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">2 Material</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Nilai Daur Ulang Tinggi</span>
              <span className="text-[11px] text-slate-500">Botol Plastik PET &amp; Kaleng Alu</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">5 Detik</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Proses Cepat per Botol</span>
              <span className="text-[11px] text-slate-500">Inspeksi multi-sensor instan</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">Langsung Cair</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Reward Poin Digital</span>
              <span className="text-[11px] text-slate-500">Tukar voucher &amp; saldo e-wallet</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Fitur Interaktif Showcase */}
      <section id="fitur" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Pengalaman Pengguna
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Kemudahan Penyetoran Dalam Genggaman
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Dirancang dengan antarmuka mobile yang intuitif, cepat, dan ramah pengguna tanpa memerlukan proses pendaftaran yang rumit.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 max-w-md w-full">
              <button
                onClick={() => setActiveTab('app')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'app'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Aplikasi Pengguna</span>
              </button>
              <button
                onClick={() => setActiveTab('machine')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'machine'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Mesin Smart RVM</span>
              </button>
              <button
                onClick={() => setActiveTab('impact')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'impact'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Leaf className="w-4 h-4" />
                <span>Dampak Daur Ulang</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            {activeTab === 'app' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile-First Web Experience
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Satu Aplikasi untuk Semua Kebutuhan Penyetoran
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aplikasi mobile Sirkula hadir tanpa beban aplikasi berat. Anda dapat mengaksesnya langsung melalui peramban ponsel pintar Anda:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Pindai QR Mesin:</strong> Buka sesi penyetoran secara aman hanya dalam satu detik melalui kamera bawaan ponsel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Peta RVM Google Maps:</strong> Temukan mesin RVM aktif terdekat lengkap dengan estimasi jarak jalan kaki dan jam operasional.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Dompet Poin &amp; Katalog Hadiah:</strong> Kumpulkan saldo koin sirkula dan tukarkan langsung dengan voucher pulsa, token listrik, saldo dompet digital, atau diskon merchant favorit.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <a
                      href={USER_APP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Buka Aplikasi Pengguna <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Simulated Phone Frame */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-sm bg-slate-900 p-3 rounded-[2.5rem] shadow-2xl border-4 border-slate-800">
                    <div className="bg-white rounded-[2rem] overflow-hidden p-4 space-y-4 text-left">
                      {/* Mobile Header Mock */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-xl shadow-xs" />
                          <div>
                            <span className="font-bold text-xs block text-slate-900 leading-none">Halo, Pengguna!</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: USR-0082</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                          Poin Aktif
                        </span>
                      </div>

                      {/* Mock Wallet Card */}
                      <div className="bg-emerald-700 text-white p-3.5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-emerald-200">
                          <span className="flex items-center gap-1 font-medium">
                            <Coins className="w-3.5 h-3.5 text-amber-300" /> Saldo Poin Sirkula
                          </span>
                          <span className="font-mono text-[10px]">480 Poin</span>
                        </div>
                        <div className="text-2xl font-black font-mono">480</div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                          <span className="bg-white text-emerald-900 font-bold py-1.5 text-center rounded-lg">
                            Tukar Hadiah
                          </span>
                          <span className="bg-emerald-800 text-white font-medium py-1.5 text-center rounded-lg">
                            Riwayat Setor
                          </span>
                        </div>
                      </div>

                      {/* Mock Machine Card */}
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Unit RVM Terdekat</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Online
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Lobby Gedung Utama · ~120m dari posisi Anda</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[65%]"></div>
                        </div>
                      </div>

                      {/* Mock Bottom Nav */}
                      <div className="flex items-center justify-around border-t border-slate-100 pt-2 text-[10px] font-medium text-slate-500">
                        <span className="text-emerald-700 font-bold">Beranda</span>
                        <span>Lokasi</span>
                        <div className="w-9 h-9 -mt-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <span>Reward</span>
                        <span>Akun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'machine' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Port Inspeksi Cerdas</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lubang masukan kemasan dilengkapi sensor proximity dan shutter pelindung otomatis. Memastikan kemasan dimasukkan satu per satu secara teratur dan aman.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Sensor Multi-Modal</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pengenalan visual dengan model AI MobileNetV3 dipadukan load cell presisi tinggi untuk memverifikasi bentuk botol dan bobot kosong kemasan secara instan.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Servo Pemilah Otomatis</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Diverter bermotor mengarahkan botol plastik PET ke wadah PET, kaleng aluminium ke wadah kaleng, dan mengembalikan objek anomali/berisi air ke pintu keluar.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Kualitas Daur Ulang Tinggi</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemisahan dari sumber menjaga kemurnian material tanpa tercampur minyak atau sampah organik, menghasilkan harga jual kembali material daur ulang yang maksimal.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Keterlacakan Rantai Pasok</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap kilogram kemasan yang terkumpul memiliki audit jejak digital lengkap dari titik pengembalian pengguna hingga penyaluran ke industri daur ulang resmi.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Insentif Nyata Bagi Masyarakat</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mengubah kesadaran lingkungan menjadi kebiasaan harian yang menguntungkan bagi semua orang melalui skema reward yang adil dan transparan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. 4 Pilar Keunggulan Sirkula */}
      <section id="solusi" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Pondasi Solusi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              4 Pilar Integritas Sirkula Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Menjawab tantangan kegagalan daur ulang konvensional melalui otomasi cerdas dan verifikasi transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Verifikasi Multi-Modal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klasifikasi kecerdasan buatan dipadukan dengan pembacaan sensor bobot untuk memastikan jenis kemasan botol PET atau kaleng aluminium secara presisi.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Pencegahan Kontaminasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secara otomatis menolak botol yang masih terisi cairan atau benda asing untuk mencegah pembusukan dan kerusakan mesin di dalam kompartemen penampungan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Reward Instan &amp; Aman</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Poin digital diterbitkan secara langsung ke akun pengguna dengan sistem pencatatan anti-klaim ganda yang menjamin kepastian perolehan reward.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Keterlacakan Rantai Pasok</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap kemasan tercatat dalam data batch terpadu, memudahkan pelaporan keberlanjutan dan penyaluran langsung ke pabrik daur ulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 5 Tahap Alur Penyetoran */}
      <section id="cara-kerja" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Alur Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              5 Langkah Mudah Menyetor di Smart RVM
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pengalaman setor cepat dan higienis hanya dalam hitungan detik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-left">
            {[
              {
                step: '1',
                title: 'Pindai QR Sesi',
                desc: 'Dekati unit Smart RVM dan pindai kode QR yang tampil di layar mesin untuk menghubungkan sesi Anda.'
              },
              {
                step: '2',
                title: 'Masukkan Kemasan',
                desc: 'Masukkan botol plastik PET atau kaleng aluminium kosong satu per satu ke lubang inspeksi mesin.'
              },
              {
                step: '3',
                title: 'Inspeksi Otomatis',
                desc: 'Kamera AI memeriksa material dan sensor timbangan memastikan kemasan bebas dari sisa cairan.'
              },
              {
                step: '4',
                title: 'Pemisahan Otomatis',
                desc: 'Mekanisme diverter otomatis mengarahkan kemasan ke wadah material yang sesuai di dalam mesin.'
              },
              {
                step: '5',
                title: 'Dapatkan Poin',
                desc: 'Poin reward langsung masuk ke dompet digital akun Anda dan siap ditukarkan kapan saja.'
              }
            ].map((s) => (
              <div key={s.step} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-slate-950">{s.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MINIMALIST VISUAL MAP & SEBARAN SMART RVM */}
      <section id="lokasi" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header - Clean & Minimal */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Titik Penyetoran Aktif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Temukan Smart RVM di Sekitar Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pantau lokasi dan ketersediaan mesin secara real-time sebelum menyetor kemasan botol dan kaleng Anda.
            </p>
          </div>

          {/* Machine Quick Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LIVE_MACHINES.map((machine) => {
              const isSelected = selectedMachine.id === machine.id;
              return (
                <button
                  key={machine.id}
                  onClick={() => handleSelectNode(machine)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm font-semibold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      machine.status === 'online'
                        ? 'bg-emerald-500'
                        : machine.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>{machine.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Visual Map & Selected Machine Card Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Spacious Map Canvas (7 cols on lg) */}
            <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[460px] bg-slate-100 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200/80">
              <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />

              {/* Top-Right Floating Reset Control */}
              <div className="absolute top-3 right-12 z-[400]">
                <button
                  onClick={handleResetMap}
                  className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm hover:bg-white text-slate-700 text-xs font-medium shadow-sm border border-slate-200/80 flex items-center gap-1.5 transition"
                  title="Pusatkan peta ke seluruh titik"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pusatkan Peta</span>
                </button>
              </div>

              {/* Bottom-Left Clean Status Legend */}
              <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl px-3 py-2 shadow-xs text-[11px] flex items-center gap-3 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Siap Setor
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Hampir Penuh
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Maintenance
                </span>
              </div>
            </div>

            {/* Right: Selected Machine Info (5 cols on lg) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedMachine.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selectedMachine.status === 'online'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : selectedMachine.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedMachine.status === 'online'
                          ? 'bg-emerald-500 animate-pulse'
                          : selectedMachine.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    {selectedMachine.statusLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    {selectedMachine.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{selectedMachine.location}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Jam Operasional: {selectedMachine.hours}</span>
                  </p>
                </div>
              </div>

              {/* Minimalist Capacity Meters */}
              <div className="space-y-3.5 py-4 border-y border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ketersediaan Tampungan:
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Wadah Botol PET</span>
                    <span className="font-semibold text-slate-900">{selectedMachine.petPercent}% Terisi</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedMachine.petPercent > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${selectedMachine.petPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Wadah Kaleng Aluminium</span>
                    <span className="font-semibold text-slate-900">{selectedMachine.aluPercent}% Terisi</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedMachine.aluPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Clean Action Button */}
              <div>
                <a
                  href={`${USER_APP_URL}/app/scan?machine=${selectedMachine.code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Buka Scanner di Mesin Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 space-y-6 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl font-extrabold text-slate-950">Seputar Layanan Sirkula</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Kemasan apa saja yang dapat disetorkan ke mesin RVM Sirkula?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Saat ini mesin menerima botol plastik minuman jenis PET (polyethylene terephthalate) bening/berwarna dan kaleng minuman aluminium dalam kondisi kosong tanpa sisa cairan.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Bagaimana cara menukarkan poin reward yang sudah terkumpul?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Buka menu Reward pada aplikasi Sirkula di ponsel Anda. Anda dapat memilih berbagai penukaran hadiah seperti pulsa telepon, paket data, saldo e-wallet, atau voucher belanja mitra.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Mengapa kemasan yang masih berisi cairan ditolak oleh mesin?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Sensor beban akan mendeteksi kelebihan berat dari cairan untuk menjaga kebersihan kompartemen internal mesin dan mencegah kontaminasi pada material daur ulang lainnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Clean Call to Action */}
      <section className="py-16 bg-emerald-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-emerald-300 text-[11px] font-mono px-3 py-1 rounded-full border border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Mulai Langkah Sirkular Hari Ini
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Siap Menjadi Bagian Dari Gerakan Daur Ulang Bersih?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto leading-relaxed">
            Temukan titik Smart RVM di sekitar Anda, setorkan botol dan kaleng bekas, dan kumpulkan reward digitalnya sekarang juga.
          </p>
          <div className="pt-2">
            <a
              href={USER_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-900/50"
            >
              <Smartphone className="w-4 h-4" /> Buka Aplikasi Sirkula Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5 text-white font-bold">
            <img src="/logo.svg" alt="Sirkula Logo" className="w-6 h-6 rounded-lg" />
            <span className="tracking-tight">SIRKULA INTELLIGENCE</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <p className="text-slate-500 text-[11px] font-mono">
              &copy; 2026 Sirkula Intelligence · Platform Ekonomi Sirkular Berbasis AIoT
            </p>
            <a
              href={ADMIN_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium text-[11px] bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-lg"
            >
              <LayoutDashboard className="w-3 h-3 text-emerald-400" />
              <span>Demo Admin</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Demo Admin Button (Pojok Kanan Bawah) */}
      <a
        href={ADMIN_APP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-slate-900/95 hover:bg-slate-950 text-white border border-slate-700 hover:border-emerald-500/50 shadow-xl backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 group"
        title="Buka Demo Admin Sirkula"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <LayoutDashboard className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-400 transition" />
        <span>Demo Admin</span>
        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition" />
      </a>
    </div>
  );
};
