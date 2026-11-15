import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER } from '@sirkula/api-client';
import { formatNumber, formatWeightKg } from '@sirkula/shared-utils';
import { Mail, Phone, HelpCircle, Shield, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const user = MOCK_USER;
  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains('dark');
  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('sirkula_theme', next ? 'dark' : 'light');
    // Force re-render
    window.location.reload();
  };

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="pt-2 pb-1">
        <h1 className="text-base font-bold text-foreground">Profil Saya</h1>
        <p className="text-xs text-muted-foreground">Informasi akun mahasiswa Sirkula.</p>
      </div>

      {/* User Info Card */}
      <div className="mobile-card p-4 flex items-center gap-3.5">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-13 h-13 rounded-full border-2 border-primary/20 object-cover"
        />
        <div className="flex-1">
          <h2 className="text-sm font-bold text-foreground">{user.name}</h2>
          <span className="text-[11px] text-muted-foreground font-mono block">{user.id}</span>
          <span className="mobile-badge mobile-badge-success text-[10px] font-mono mt-1">
            Member Terverifikasi
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="mobile-card p-3">
          <span className="text-base font-bold font-mono text-foreground block">{formatNumber(user.pointsBalance)}</span>
          <span className="text-[10px] text-muted-foreground">Poin Aktif</span>
        </div>
        <div className="mobile-card p-3">
          <span className="text-base font-bold font-mono text-foreground block">{user.totalTransactions}</span>
          <span className="text-[10px] text-muted-foreground">Transaksi</span>
        </div>
        <div className="mobile-card p-3">
          <span className="text-base font-bold font-mono text-foreground block">{formatWeightKg(user.totalWeightKg)}</span>
          <span className="text-[10px] text-muted-foreground">Terkumpul</span>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mobile-card p-4 space-y-2.5 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kontak &amp; Identitas</h3>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground">{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Menu Settings List */}
      <div className="mobile-card divide-y divide-border text-xs overflow-hidden">
        <Link
          to="/app/bantuan"
          className="p-3.5 flex items-center justify-between hover:bg-muted/40 transition"
        >
          <span className="flex items-center gap-2.5 text-foreground font-medium">
            <HelpCircle className="w-4 h-4 text-muted-foreground" /> Bantuan &amp; FAQ
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>

        {/* Theme Switcher Row */}
        <button
          onClick={toggleTheme}
          className="w-full p-3.5 flex items-center justify-between hover:bg-muted/40 transition text-left"
        >
          <span className="flex items-center gap-2.5 text-foreground font-medium">
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
            Mode Tampilan ({isDark ? 'Gelap' : 'Terang'})
          </span>
          <span className="text-[11px] text-primary font-bold">Ubah</span>
        </button>

        <div className="p-3.5 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-2.5 font-medium">
            <Shield className="w-4 h-4 text-muted-foreground" /> Versi Aplikasi
          </span>
          <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-full border border-border">v2.0 Native</span>
        </div>
      </div>

      {/* Solid Logout Button */}
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-destructive-soft text-destructive hover:bg-destructive/10 font-bold text-xs py-3 rounded-xl border border-destructive/20 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" /> Keluar dari Akun Demo
      </button>
    </div>
  );
};
