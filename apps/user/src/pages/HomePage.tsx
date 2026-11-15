import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_USER, MOCK_TRANSACTIONS } from '@sirkula/api-client';
import { formatNumber, formatWeightKg, formatDateId } from '@sirkula/shared-utils';
import {
  QrCode,
  Gift,
  History,
  ArrowRight,
  Coins,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  Bell
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const user = MOCK_USER;
  const recentTx = MOCK_TRANSACTIONS.slice(0, 3);

  return (
    <div className="space-y-4 p-4">
      {/* 1. Mobile App Top Greeting (No web navbar) */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-11 h-11 rounded-full border-2 border-primary/20 object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-foreground">Halo, {user.name.split(' ')[0]}!</h1>
              <span className="text-[10px] font-semibold bg-primary-soft text-primary px-1.5 py-0.5 rounded-full">
                Member
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Siap memulihkan kemasan hari ini?</p>
          </div>
        </div>

        <Link
          to="/app/bantuan"
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-card"
          title="Bantuan & Notifikasi"
        >
          <Bell className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. Solid Points Wallet Card (No glassmorphism, clean solid emerald) */}
      <div className="bg-emerald-700 text-white rounded-2xl p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-100 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-300" /> Saldo Poin Sirkula
          </span>
          <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
            {user.id}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black font-mono tracking-tight text-white">
            {formatNumber(user.pointsBalance)}
          </span>
          <span className="text-xs font-semibold text-emerald-200">Poin Aktif</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-600/60">
          <Link
            to="/app/reward"
            className="bg-white text-emerald-900 hover:bg-emerald-50 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition"
          >
            <Gift className="w-4 h-4 text-emerald-700" />
            <span>Tukar Reward</span>
          </Link>
          <Link
            to="/app/riwayat"
            className="bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition"
          >
            <History className="w-4 h-4" />
            <span>Riwayat Poin</span>
          </Link>
        </div>
      </div>

      {/* 3. Primary Mobile Action: Setor Kemasan CTA */}
      <div className="mobile-card p-4 flex items-center justify-between gap-3 border-emerald-200 dark:border-emerald-950 bg-card">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Aksi Penyetoran
          </span>
          <h2 className="text-sm font-bold text-foreground">Setor di Mesin RVM</h2>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Pindai QR pada layar Smart RVM untuk inisiasi sesi setor botol &amp; kaleng.
          </p>
        </div>
        <Link
          to="/app/scan"
          className="mobile-btn-primary px-3.5 py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-sm shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </Link>
      </div>

      {/* 4. Stat Grid: Pemulihan Kemasan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Kontribusi Anda
          </h3>
          <Link to="/app/impact" className="text-xs font-semibold text-primary flex items-center gap-0.5">
            Lihat Dampak <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="mobile-card p-3 text-center">
            <span className="text-lg font-black font-mono text-foreground block">{user.totalPetCount}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Botol PET</span>
          </div>
          <div className="mobile-card p-3 text-center">
            <span className="text-lg font-black font-mono text-foreground block">{user.totalAluCount}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Kaleng Alu</span>
          </div>
          <div className="mobile-card p-3 text-center">
            <span className="text-lg font-black font-mono text-foreground block">{formatWeightKg(user.totalWeightKg)}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Total Berat</span>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Aktivitas Terakhir
          </h3>
          <Link to="/app/riwayat" className="text-xs font-semibold text-primary">
            Semua
          </Link>
        </div>

        <div className="space-y-2">
          {recentTx.map((tx) => (
            <Link
              key={tx.id}
              to={`/app/transaction/${tx.id}`}
              className="mobile-card p-3 flex items-center justify-between hover:border-primary/40 active:scale-99 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs ${
                    tx.status === 'ACCEPTED'
                      ? 'bg-primary-soft text-primary'
                      : 'bg-destructive-soft text-destructive'
                  }`}
                >
                  {tx.material === 'PET' ? 'PET' : tx.material === 'ALUMINUM' ? 'ALU' : 'UNK'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{tx.materialLabel}</h4>
                  <span className="text-[10px] text-muted-foreground block">
                    {tx.machineName} · {formatDateId(tx.timestamp)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-bold font-mono block ${
                    tx.rewardPoints > 0 ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {tx.rewardPoints > 0 ? `+${tx.rewardPoints} Poin` : '0 Poin'}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                  {tx.status === 'ACCEPTED' ? (
                    <CheckCircle2 className="w-3 h-3 text-primary inline" />
                  ) : (
                    <XCircle className="w-3 h-3 text-destructive inline" />
                  )}
                  {tx.status === 'ACCEPTED' ? 'Diterima' : 'Ditolak'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. User-friendly Tip Card */}
      <div className="mobile-card p-3 bg-muted/40 border border-border flex items-start gap-2.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>Tips Setor:</strong> Pastikan botol kosong dari sisa air. Sensor timbangan RVM otomatis menolak botol yang masih terisi cairan.
        </p>
      </div>
    </div>
  );
};
