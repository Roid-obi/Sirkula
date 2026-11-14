import React, { useState } from 'react';
import {
  QrCode,
  Cpu,
  Scale,
  ShieldCheck,
  Recycle,
  Boxes,
  ArrowRight,
  AlertCircle,
  Server,
  Smartphone,
  MapPin,
  Coins,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Wifi,
  Clock,
  Activity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin' | 'hardware'>('user');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Top Hackathon Header Strip */}
      <div className="bg-slate-950 text-emerald-400 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-bold tracking-wider text-[11px] uppercase text-emerald-300">
              UNS Innovation Hackathon 2026
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              Solusi Ekonomi Sirkular Berbasis AIoT &amp; Keterlacakan Material
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80">
              3 Aplikasi Aktif
            </span>
            <span>Kampus Kentingan UNS</span>
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
                  UNS 2026
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block -mt-0.5">
                Material Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#ekosistem" className="hover:text-emerald-700 transition">Ekosistem</a>
            <a href="#preview" className="hover:text-emerald-700 transition">Pratinjau Live</a>
            <a href="#pilar" className="hover:text-emerald-700 transition">4 Pilar Solusi</a>
            <a href="#cara-kerja" className="hover:text-emerald-700 transition">5 Tahap Setor</a>
            <a href="#teknologi" className="hover:text-emerald-700 transition">Teknologi AIoT</a>
            <a href="#lokasi" className="hover:text-emerald-700 transition">Lokasi RVM</a>
            <a href="#faq" className="hover:text-emerald-700 transition">FAQ</a>
          </nav>

          {/* Direct App Launch Links */}
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 transition flex items-center gap-1.5 border border-slate-200"
              title="Buka Admin Dashboard di Port 3001"
            >
              <Server className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="font-mono text-[10px] text-slate-500">:3001</span>
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Buka User Mobile App di Port 3002"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>User App</span>
              <span className="font-mono text-[10px] text-emerald-200">:3002</span>
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
            <span>Prototipe Multi-Modal AIoT untuk Pemulihan Kemasan Minuman Bersih</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Kemasan Terpilah Bersih, <br className="hidden sm:inline" />
            <span className="text-emerald-700">Keterlacakan Nyata</span> dari Kampus UNS.
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SIRKULA mengintegrasikan <strong>Smart Reverse Vending Machine (RVM)</strong> dengan visi komputer MobileNetV3 dan timbangan HX711, <strong>User Mobile App</strong> berhadiah poin instan idempoten, serta <strong>Admin Intelligence Dashboard</strong> untuk ketertelusuran batch material daur ulang.
          </p>

          {/* Live Action Buttons Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" /> Buka User App (Mobile)
              <span className="font-mono text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-100">
                localhost:3002
              </span>
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-6 py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Server className="w-4 h-4 text-emerald-700" /> Buka Admin Dashboard Operator
              <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                localhost:3001
              </span>
            </a>
            <a
              href="#preview"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-5 py-3.5 rounded-2xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-slate-500" /> Lihat Pratinjau
            </a>
          </div>

          {/* 4 Hero KPI Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-8 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">4 Unit</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Smart RVM Kentingan</span>
              <span className="text-[11px] text-slate-500">Perpus, FMIPA, SPMB, SV</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">2 Material</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Target MVP</span>
              <span className="text-[11px] text-slate-500">Botol Plastik PET &amp; Kaleng Alu</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">5 Tahap</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Integritas Sensor</span>
              <span className="text-[11px] text-slate-500">Visi AI + HX711 + Servo Sortir</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black font-mono text-emerald-700 block">100%</span>
              <span className="text-xs font-semibold text-slate-900 block mt-0.5">Idempoten &amp; Aman</span>
              <span className="text-[11px] text-slate-500">Anti-klaim poin reward ganda</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Preview Showcase */}
      <section id="preview" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Pratinjau Ekosistem Terpadu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Dua Antarmuka yang Saling Terhubung Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Eksplorasi antarmuka pengguna mobile untuk mahasiswa dan dasbor operator kampus untuk pengawasan logistik.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 max-w-md w-full">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'user'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>User Mobile App</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'hardware'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Hardware RVM</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            {activeTab === 'user' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full">
                    <Smartphone className="w-3.5 h-3.5" /> Berjalan di Port 3002
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Aplikasi Mobile Mahasiswa (Native Style)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dirancang dengan gaya mobile app modern tanpa glassmorphism, menggunakan solid surface emerald dan bottom navigation bar yang nyaman dioperasikan satu tangan:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Pindai QR Mesin:</strong> Otentikasi sesi setor instan dengan targeting frame dan fallback input manual ID mesin.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Peta Google Maps Style:</strong> Peta interaktif sebaran 4 RVM di Kampus UNS dengan estimasi jarak jalan kaki dan status kapasitas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Dompet Poin &amp; Reward:</strong> Saldo koin digital terbit seketika yang dapat ditukarkan voucher pulsa, kantin, dan e-wallet.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <a
                      href="http://localhost:3002"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Buka User App Sekarang <ExternalLink className="w-3.5 h-3.5" />
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
                            <span className="font-bold text-xs block text-slate-900 leading-none">Halo, Budi!</span>
                            <span className="text-[10px] text-slate-500 font-mono">USR-UNS-0082</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                          UNS Aktif
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
                            Tukar Reward
                          </span>
                          <span className="bg-emerald-800 text-white font-medium py-1.5 text-center rounded-lg">
                            Riwayat Poin
                          </span>
                        </div>
                      </div>

                      {/* Mock Machine Card */}
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Perpustakaan Pusat UNS</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Online
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Lantai 1 Lobby · ~120m dari posisi Anda</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[68%]"></div>
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

            {activeTab === 'admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-slate-900 text-emerald-400 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full">
                    <Server className="w-3.5 h-3.5" /> Berjalan di Port 3001
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Dasbor Pengawasan Operator Sirkula
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menyediakan pengawasan operasional hulu-ke-hilir untuk tim pengelola kebersihan dan logistik daur ulang Kampus UNS:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Monitoring Unit RVM &amp; Peta Jaringan:</strong> Pantau kapasitas wadah terpilah PET &amp; Aluminium dan kualitas sinyal Wi-Fi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Ledger Transaksi &amp; Hash Verifikasi:</strong> Rekaman audit digital tanpa risiko modifikasi manual.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Logistik Pengumpulan &amp; Anomali:</strong> Deteksi dini jika wadah hampir penuh (&gt;85%) dan rekap rute angkut ke bank sampah.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <a
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Buka Admin Dashboard Sekarang <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Simulated Desktop Admin Window */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-left text-xs">
                    <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="font-mono text-[11px] text-slate-400 ml-2">
                          Sirkula Intelligence Operator · localhost:3001
                        </span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded">
                        4 RVM Online
                      </span>
                    </div>

                    <div className="p-5 space-y-4 text-slate-300">
                      <div className="grid grid-cols-3 gap-3 font-mono">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Total Kemasan</span>
                          <span className="text-lg font-bold text-white">4.821 unit</span>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Bobot Bersih</span>
                          <span className="text-lg font-bold text-emerald-400">92,4 kg</span>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 block">Integritas Hash</span>
                          <span className="text-lg font-bold text-white">100% Valid</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 space-y-2">
                        <span className="text-[11px] font-bold text-slate-300 block">
                          Status Titik RVM UNS Kentingan:
                        </span>
                        <div className="space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                            <span>RVM-UNS-01 (Perpustakaan Pusat)</span>
                            <span className="text-emerald-400">PET: 68% · Alu: 52% (Normal)</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                            <span>RVM-UNS-02 (Gedung B FMIPA)</span>
                            <span className="text-amber-400">PET: 89% (Jadwal Angkut Sore)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">ESP32-S3 Dual Core</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mikrokontroler 240MHz dengan akselerasi instruksi vektor. Menjalankan state machine lokal, komunikasi aman MQTT/TLS, dan kendali servo diverter gate.
                  </p>
                  <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Komputasi Tepi (Edge)
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Load Cell + ADC HX711</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pengukuran berat kosong kemasan dengan presisi gram. Memvalidasi bobot botol PET (12-25g) dan kaleng aluminium (12-18g) untuk menolak botol berisi cairan.
                  </p>
                  <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Anti-Kontaminasi Cairan
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Kamera AI MobileNetV3</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sensor kamera optik OV2640 dengan inferensi model ringan untuk mengenali bentuk kemasan secara visual dengan ambang keyakinan tinggi (&gt;85%).
                  </p>
                  <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Computer Vision Teruji
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Empat Pilar Solusi */}
      <section id="pilar" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Pilar Solusi Sirkula
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              4 Pondasi Integritas Sistem Daur Ulang Kampus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Menjawab kelemahan sistem pengumpulan sampah konvensional melalui otomasi cerdas dan audit digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Deteksi Multi-Modal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kombinasi sensor visi komputer dan load cell mengonfirmasi jenis material dan keabsahan botol secara simultan sebelum gerbang sortir terbuka.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Perlindungan Anomali</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secara otomatis menolak botol yang masih terisi air, sampah kantong kresek, atau batu demi menjaga kemurnian material di kompartemen penampungan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Reward Idempoten</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Poin digital diterbitkan secara atomik menggunakan kunci idempotensi unik pada setiap transaksi yang tervalidasi. Anti-duplikasi saldo.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Keterlacakan Pasok</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap botol terpilah dikaitkan langsung ke ID batch logistik kampus, mempermudah pelaporan keberlanjutan dan penjualan ke pabrik daur ulang.
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
              Alur Penyetoran End-to-End
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              5 Langkah Pengembalian Otomatis di Mesin RVM
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Proses penyetoran cepat hanya membutuhkan waktu rata-rata 3 hingga 5 detik per botol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-left">
            {[
              {
                step: '1',
                title: 'Pindai QR Sesi',
                desc: 'Pengguna memindai QR code pada layar mesin menggunakan User App untuk mengotorisasi sesi setor.'
              },
              {
                step: '2',
                title: 'Masukkan Botol/Kaleng',
                desc: 'Satu kemasan dimasukkan ke dalam port inspeksi RVM dalam kondisi kosong tanpa sisa air.'
              },
              {
                step: '3',
                title: 'Inspeksi AI & Timbangan',
                desc: 'Kamera AI memprediksi material PET/Alu dan load cell HX711 mengukur berat kosong kemasan.'
              },
              {
                step: '4',
                title: 'Sortir Servo Diverter',
                desc: 'Servo diverter bergerak otomatis mengarahkan kemasan ke wadah material yang sesuai.'
              },
              {
                step: '5',
                title: 'Terima Poin Digital',
                desc: 'Poin reward masuk seketika ke akun dan transaksi tercatat dalam batch logistik.'
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

      {/* 7. Lokasi Sebaran Mesin di Kampus UNS */}
      <section id="lokasi" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Peta Sebaran Kampus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              4 Titik Smart RVM di Kampus Kentingan UNS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ditempatkan secara strategis di area dengan lalu lintas civitas akademika tertinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500">RVM-UNS-01</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Perpustakaan Pusat UNS</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> Lantai 1 Lobby Utama
              </p>
              <div className="text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                PET: 136/200 (68%) · Alu: 78/150 (52%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500">RVM-UNS-02</span>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Hampir Penuh
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Gedung B FMIPA UNS</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> Koridor Utama Mahasiswa
              </p>
              <div className="text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                PET: 178/200 (89%) · Alu: 62/150 (41%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500">RVM-UNS-03</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Gedung SPMB UNS</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> Ruang Tunggu Pelayanan
              </p>
              <div className="text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                PET: 92/200 (46%) · Alu: 44/150 (29%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500">RVM-UNS-04</span>
                <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Offline / Pemeliharaan
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Sekolah Vokasi UNS</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> Pintu Masuk Kolese
              </p>
              <div className="text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                Status: Sinyal Wi-Fi Terputus
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
              Pertanyaan &amp; Jawaban
            </span>
            <h2 className="text-2xl font-extrabold text-slate-950">Prinsip &amp; Transparansi Prototipe</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Apakah prototipe ini sudah terhubung dengan mesin fisik riil?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Sesuai prinsip transparansi blueprint, saat ini prototipe berjalan dalam mode demo interaktif frontend dan simulasi state machine mikrokontroler Wokwi ESP32, tanpa klaim palsu integrasi fisik sebelum sertifikasi uji lapangan.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Bagaimana sistem mencegah klaim reward ganda (double-spend)?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Backend menerapkan prinsip atomik dan <em>idempotency key</em> unik pada setiap transaksi yang diterima. Permintaan refresh atau klik berulang tidak akan menambah poin duplikat.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                Mengapa difokuskan pada botol PET dan kaleng aluminium?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Kedua jenis kemasan ini menyumbang volume sampah minuman terbesar di kantin kampus UNS serta memiliki nilai ekonomi dan daur ulang tertinggi bagi rantai pasok industri sirkular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Preview Links CTA Banner */}
      <section className="py-12 bg-emerald-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            Coba Langsung Seluruh Ekosistem Sirkula
          </h3>
          <p className="text-xs text-emerald-200 max-w-xl mx-auto leading-relaxed">
            Klik tautan port di bawah untuk membuka prototipe aplikasi secara mandiri di peramban Anda:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
            <a
              href="http://localhost:3000"
              className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-700/80 transition flex items-center gap-1.5"
            >
              🌐 Landing: <strong>:3000</strong>
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-700/80 transition flex items-center gap-1.5"
            >
              💻 Admin Dashboard: <strong>:3001</strong>
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              📱 User Mobile App: <strong>:3002</strong>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5 text-white font-bold">
            <img src="/logo.svg" alt="Sirkula Logo" className="w-6 h-6 rounded-lg" />
            <span className="tracking-tight">SIRKULA INTELLIGENCE · UNS Hackathon 2026</span>
          </div>
          <p className="text-slate-500 text-[11px] font-mono">
            Karya Mahasiswa Universitas Sebelas Maret (UNS) · Surakarta, Jawa Tengah
          </p>
        </div>
      </footer>
    </div>
  );
};
