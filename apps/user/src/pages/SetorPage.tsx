import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, MapPin, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

export const SetorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4">
      {/* Native Mobile App Bar */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Panduan Setor Kemasan</h1>
      </div>

      {/* Main Action Card */}
      <div className="mobile-card p-5 space-y-3 bg-card border-primary/30">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
              Langkah Pertama
            </span>
            <h2 className="text-base font-bold text-foreground">Pindai QR di Mesin RVM</h2>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Dekati unit Smart RVM Sirkula di kampus UNS, klik tombol di bawah untuk membuka kamera dan arahkan ke layar mesin.
        </p>

        <Link
          to="/app/scan"
          className="w-full mobile-btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm text-center"
        >
          <QrCode className="w-4 h-4" /> Buka Scanner Kamera
        </Link>
      </div>

      {/* 5-Step Visual Timeline */}
      <div className="mobile-card p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          5 Tahap Penyetoran Otomatis
        </h3>

        <div className="space-y-3 text-xs">
          {[
            { num: '1', title: 'Pindai QR Sesi', desc: 'Aplikasi memverifikasi mesin & mengotorisasi sesi penyetoran.' },
            { num: '2', title: 'Masukkan Kemasan', desc: 'Masukkan satu botol atau kaleng ke lubang inspeksi RVM.' },
            { num: '3', title: 'Inspeksi AI & Timbangan', desc: 'Kamera mengenali material & sensor HX711 memverifikasi berat kosong.' },
            { num: '4', title: 'Sortir Servo Otomatis', desc: 'Servo diverter mengarahkan objek ke kompartemen material terpilah.' },
            { num: '5', title: 'Terima Poin Digital', desc: 'Poin digital terbit seketika ke saldo akun Anda.' }
          ].map((s) => (
            <div key={s.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center shrink-0 text-xs font-mono">
                {s.num}
              </span>
              <div>
                <strong className="text-foreground text-xs block">{s.title}</strong>
                <span className="text-[11px] text-muted-foreground leading-tight block">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accepted & Rejected Rules */}
      <div className="mobile-card p-4 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ketentuan Kemasan</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-primary-soft/40 border border-primary/20 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <CheckCircle2 className="w-4 h-4" /> Diterima
            </div>
            <ul className="text-muted-foreground text-[11px] space-y-1 list-disc list-inside">
              <li>Botol plastik PET</li>
              <li>Kaleng aluminium</li>
              <li>Kondisi kosong</li>
            </ul>
          </div>

          <div className="bg-destructive-soft/40 border border-destructive/20 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-destructive font-bold">
              <AlertCircle className="w-4 h-4" /> Ditolak (Reject)
            </div>
            <ul className="text-muted-foreground text-[11px] space-y-1 list-disc list-inside">
              <li>Masih berisi air/es</li>
              <li>Kaca / kantong kresek</li>
              <li>Benda asing / batu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Find Nearest Machine Button */}
      <Link
        to="/app/lokasi"
        className="w-full mobile-card p-3 text-xs text-foreground font-semibold flex items-center justify-between hover:bg-muted/40 transition"
      >
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Lihat Peta Lokasi RVM Kampus UNS
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </Link>
    </div>
  );
};
