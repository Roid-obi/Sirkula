import React from 'react';
import {
  Leaf,
  QrCode,
  Cpu,
  Scale,
  Sparkles,
  ShieldCheck,
  Recycle,
  Boxes,
  ArrowRight,
  AlertCircle,
  Server
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Top Hackathon Banner */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center font-medium">
        <span>UNS Innovation Hackathon 2026 · Karya Prototipe Ekosistem Ekonomi Sirkular Berbasis AIoT</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-emerald-950">SIRKULA</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-emerald-700 ml-2 tracking-wider">
                Material Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#masalah" className="hover:text-emerald-800 transition">Tantangan</a>
            <a href="#solusi" className="hover:text-emerald-800 transition">Solusi AIoT</a>
            <a href="#cara-kerja" className="hover:text-emerald-800 transition">Cara Kerja</a>
            <a href="#teknologi" className="hover:text-emerald-800 transition">Teknologi</a>
            <a href="#lokasi" className="hover:text-emerald-800 transition">Lokasi Mesin</a>
            <a href="#faq" className="hover:text-emerald-800 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              <Server className="w-3.5 h-3.5 text-gray-500" /> Admin
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              Buka User App <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kecerdasan Material Multi-Modal untuk Daur Ulang Bersih</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Pemulihan dan Keterlacakan Kemasan Minuman Berbasis <span className="text-emerald-700">AIoT</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            SIRKULA mentransformasikan Reverse Vending Machine (RVM) dengan integrasi Computer Vision, sensor timbangan, dan ledger reward digital yang aman dan idempoten di Kampus Universitas Sebelas Maret.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> Coba Prototipe User App (Setor)
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Server className="w-4 h-4 text-emerald-700" /> Buka Admin Dashboard Operator
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-left">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="text-2xl font-black text-emerald-800 block">4 Titik</span>
              <span className="text-xs text-gray-500 font-medium">Smart RVM Kentingan</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="text-2xl font-black text-emerald-800 block">2 Kategori</span>
              <span className="text-xs text-gray-500 font-medium">Fokus MVP: PET & Alu</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="text-2xl font-black text-emerald-800 block">5 Tahap</span>
              <span className="text-xs text-gray-500 font-medium">Verifikasi Integritas</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <span className="text-2xl font-black text-emerald-800 block">0 Duplikasi</span>
              <span className="text-xs text-gray-500 font-medium">Ledger Reward Idempoten</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="masalah" className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tantangan Lapangan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">Mengapa Sampah Kemasan Sering Gagal Didaur Ulang?</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Meskipun botol PET dan kaleng aluminium bernilai ekonomi tinggi, sistem pengumpulan konvensional menghadapi kendala struktural:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Kontaminasi & Pencampuran</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Botol bercampur dengan sampah organik atau masih berisi sisa cairan, menurunkan nilai jual material dan merusak proses daur ulang.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Pencatatan Manual Rentan Bias</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tanpa verifikasi sensor dan kamera otomatis, pencatatan berat dan jumlah material di titik pengumpulan sering kali tidak akurat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Hilangnya Rantai Keterlacakan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mitra daur ulang kesulitan memverifikasi asal-usul material karena tidak adanya tautan data transaksi digital ke batch pengumpulan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Alur End-to-End</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">Pengalaman Pengembalian 5 Langkah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Pindai QR Sesi', desc: 'Pengguna scan QR mesin via User App untuk otorisasi sesi setor aman.' },
              { step: '02', title: 'Masukkan Kemasan', desc: 'Kemasan kosong dimasukkan satu per satu ke lubang inspeksi RVM.' },
              { step: '03', title: 'Inspeksi Multi-Modal', desc: 'Kamera AI memprediksi material & load cell HX711 mengukur berat kosong.' },
              { step: '04', title: 'Sortir Otomatis', desc: 'Servo diverter mengarahkan objek ke kompartemen material atau jalur reject.' },
              { step: '05', title: 'Poin & Keterlacakan', desc: 'Poin digital terbit satu kali dan data tercatat ke batch daur ulang.' }
            ].map((s) => (
              <div key={s.step} className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="teknologi" className="py-16 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Arsitektur Perangkat</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Teknologi Smart RVM & Material Intelligence</h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              Kombinasi komputasi tepi mikrokontroler dan model visi komputer yang efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">ESP32-S3 Microcontroller</h3>
              <p className="text-emerald-200/80 leading-relaxed">
                Mengendalikan state machine lokal, komunikasi Wi-Fi/MQTT aman ke backend, pembacaan sensor realtime, dan penggerak servo gate & diverter.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
              <Scale className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Load Cell + HX711 Precision</h3>
              <p className="text-emerald-200/80 leading-relaxed">
                Mendeteksi anomali berat kosong kemasan untuk menolak botol yang masih berisi cairan atau benda asing berlebih sebelum diterima.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Computer Vision (MobileNetV3)</h3>
              <p className="text-emerald-200/80 leading-relaxed">
                Klasifikasi visual cepat dengan ambang keyakinan (confidence threshold) ketat untuk membedakan botol PET, kaleng aluminium, dan unknown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Ekosistem Hilir & Mitra Pengumpulan Kampus
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-gray-600">
            <span className="p-3 bg-gray-50 rounded-xl border border-gray-100">Universitas Sebelas Maret (UNS)</span>
            <span className="p-3 bg-gray-50 rounded-xl border border-gray-100">Bank Sampah Induk Surakarta</span>
            <span className="p-3 bg-gray-50 rounded-xl border border-gray-100">PT Solo Daur Ulang Mandiri</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tanya Jawab</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <h3 className="font-bold text-gray-900">Apakah prototipe ini sudah terhubung dengan mesin fisik riil?</h3>
              <p className="text-gray-600 leading-relaxed">
                Sesuai prinsip kejujuran klaim dokumen blueprint, saat ini prototipe antarmuka dan kontrol simulasi ESP32 Wokwi berjalan secara independen dan belum dihubungkan dengan integrasi fisik penuh.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <h3 className="font-bold text-gray-900">Bagaimana sistem mencegah pemberian reward ganda?</h3>
              <p className="text-gray-600 leading-relaxed">
                Backend menerapkan prinsip atomik dan idempotency key unik pada setiap transaksi accepted. Sesi atau refresh request tidak akan menggandakan penambahan poin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 text-xs py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>SIRKULA INTELLIGENCE · UNS Hackathon 2026</span>
          </div>
          <p className="text-gray-500 text-[11px]">
            Dikembangkan oleh Tim Mahasiswa Universitas Sebelas Maret (UNS).
          </p>
        </div>
      </footer>
    </div>
  );
};
