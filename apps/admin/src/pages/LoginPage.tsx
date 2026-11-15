import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Cpu, Database } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAdmin();
  const [email, setEmail] = useState('admin@sirkula.id');
  const [password, setPassword] = useState('sirkula2026');
  const [zone, setZone] = useState('pusat');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Selamat Datang!', 'Masuk sebagai Administrator Pusat Sirkula.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-12 text-foreground">
      {/* Left Visual Showcase */}
      <div className="lg:col-span-6 bg-slate-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Sirkula Logo" className="w-10 h-10 rounded-2xl shadow-sm" />
            <div>
              <span className="font-black text-xl tracking-tight block">SIRKULA</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Material Intelligence
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs px-3 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Admin Control &amp; Aggregator Hub v1.0</span>
          </div>
        </div>

        <div className="relative z-10 py-12 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Transparansi Pemulihan Kemasan Dari Hulu ke Hilir.
          </h2>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Sistem pengawasan terpusat untuk memantau sebaran mesin Smart RVM, verifikasi multi-sensor, validasi batch logistik, dan pencegahan fraud secara real-time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">4 RVM Aktif</div>
              <div className="text-[10px] text-slate-400">Node IoT Telemetri</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">Multi-Modal</div>
              <div className="text-[10px] text-slate-400">AI + Load Cell HX711</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <Database className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">Batch Terlacak</div>
              <div className="text-[10px] text-slate-400">Integrasi Daur Ulang</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-slate-500">
          &copy; 2026 Sirkula Intelligence · Platform Ekonomi Sirkular Berbasis AIoT
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Masuk ke Panel Pengelola
            </h2>
            <p className="text-xs text-muted-foreground">
              Gunakan akun operator Sirkula untuk mengakses dashboard pemantauan mesin dan transaksi.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">Email Operator</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground font-mono focus:outline-none focus:border-primary shadow-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground block">Kata Sandi</label>
                <span className="text-[11px] text-muted-foreground font-mono">Sesi Prototipe</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground font-mono focus:outline-none focus:border-primary shadow-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">Wilayah Operasional</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-xs"
              >
                <option value="pusat">Wilayah Operasional Utama (Pusat)</option>
              </select>
            </div>

            {/* Demo Hint */}
            <div className="bg-primary-soft/50 border border-primary/20 p-3 rounded-xl text-[11px] text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Mode Demo: Langsung tekan tombol masuk untuk mengakses dashboard.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground pt-4 border-t border-border">
            Sistem autentikasi operasional terpadu Sirkula Intelligence.
          </p>
        </div>
      </div>
    </div>
  );
};
