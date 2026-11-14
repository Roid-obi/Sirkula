import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi.santoso@student.uns.ac.id');
  const [phone, setPhone] = useState('0812-3456-7890');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-foreground">Daftar Akun Baru</h1>
            <span className="text-[10px] font-bold font-mono text-primary uppercase block -mt-0.5">
              Sirkula UNS Ecosystem
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-1">
          <h2 className="text-xl font-black text-foreground">Bergabung dengan Sirkula 🌿</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mulai langkah pemulihan kemasan sirkular dan kumpulkan reward di Smart RVM UNS.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="my-auto py-4">
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono shadow-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Email Mahasiswa (SSO / student.uns.ac.id)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono shadow-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Nomor WhatsApp Aktif</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono shadow-xs"
              required
            />
          </div>

          <div className="bg-primary-soft/50 border border-primary/20 p-3 rounded-xl text-[11px] text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Mode Demo: Klik tombol di bawah untuk langsung mencoba akun demo.</span>
          </div>

          <button
            type="submit"
            className="w-full mobile-btn-primary py-3.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            Daftar Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 text-xs text-muted-foreground">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground pb-2 font-mono">
        UNS Innovation Hackathon 2026 · Sirkula Ecosystem
      </div>
    </div>
  );
};
