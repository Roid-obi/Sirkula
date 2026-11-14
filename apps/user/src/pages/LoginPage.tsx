import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('budi.santoso@student.uns.ac.id');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Brand Area (Native App Header) */}
      <div className="pt-6 space-y-3">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Sirkula Logo" className="w-10 h-10 rounded-2xl shadow-sm" />
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-foreground">SIRKULA</h1>
            <span className="text-[10px] font-bold font-mono text-primary uppercase block -mt-0.5">
              Material Intelligence User App
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-1">
          <h2 className="text-xl font-black text-foreground">Selamat Datang 👋</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Masuk untuk menyetor botol PET &amp; kaleng aluminium di Smart RVM Kampus UNS.
          </p>
        </div>
      </div>

      {/* Main Solid Form (No glassmorphism) */}
      <div className="my-auto py-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Email Mahasiswa / No. Ponsel</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono shadow-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground block">Kata Sandi</label>
              <span className="text-[11px] text-primary font-medium hover:underline cursor-pointer">
                Lupa Sandi?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono shadow-xs"
              required
            />
          </div>

          {/* Quick Demo Info Pill */}
          <div className="bg-primary-soft/50 border border-primary/20 p-3 rounded-xl text-[11px] text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Mode Demo: Langsung klik tombol masuk untuk mencoba aplikasi.</span>
          </div>

          <button
            type="submit"
            className="w-full mobile-btn-primary py-3.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            Masuk ke Aplikasi <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 text-xs text-muted-foreground">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-muted-foreground pb-2 font-mono">
        UNS Innovation Hackathon 2026 · Sirkula Ecosystem
      </div>
    </div>
  );
};
