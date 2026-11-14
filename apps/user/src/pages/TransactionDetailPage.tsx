import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_TRANSACTIONS } from '@sirkula/api-client';
import { formatDateId, formatWeightKg } from '@sirkula/shared-utils';
import { CheckCircle2, XCircle, ArrowLeft, ShieldCheck, Home } from 'lucide-react';

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === id) || MOCK_TRANSACTIONS[0];

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <button
          onClick={() => navigate('/app/riwayat')}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Bukti Transaksi Setor</h1>
      </div>

      {/* Main Status & Receipt Card */}
      <div className="mobile-card p-5 text-center space-y-3">
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${
            tx.status === 'ACCEPTED'
              ? 'bg-primary-soft text-primary border-primary/20'
              : 'bg-destructive-soft text-destructive border-destructive/20'
          }`}
        >
          {tx.status === 'ACCEPTED' ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <XCircle className="w-7 h-7" />
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Status Transaksi
          </span>
          <h2 className="text-base font-bold text-foreground mt-0.5">{tx.statusLabel}</h2>
          <span className="text-xs text-muted-foreground font-mono mt-0.5 block">{tx.id}</span>
        </div>

        {tx.rewardPoints > 0 && (
          <div className="mobile-badge mobile-badge-success text-xs font-mono font-bold px-3 py-1">
            +{tx.rewardPoints} Poin Digital Diterbitkan
          </div>
        )}
      </div>

      {/* Telemetry Breakdown */}
      <div className="mobile-card p-4 space-y-3 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rincian Kemasan &amp; Mesin</h3>
        
        <div className="divide-y divide-border space-y-2">
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Kategori Material</span>
            <strong className="text-foreground">{tx.materialLabel}</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Berat Bersih</span>
            <strong className="text-foreground font-mono">{tx.weightG}g ({formatWeightKg(tx.weightKg)})</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Unit RVM</span>
            <strong className="text-foreground">{tx.machineName}</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Waktu Selesai</span>
            <strong className="text-foreground">{formatDateId(tx.timestamp)}</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Skor Visi Komputer</span>
            <strong className="text-foreground font-mono">{tx.aiConfidence ? `${Math.round(tx.aiConfidence * 100)}%` : '-'}</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Versi Model CV</span>
            <strong className="text-foreground font-mono text-[11px]">{tx.modelVersion || 'SirkulaCV-v1.2'}</strong>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Idempotency Key</span>
            <strong className="text-muted-foreground font-mono text-[10px] truncate max-w-[170px]">{tx.idempotencyKey || 'N/A'}</strong>
          </div>
        </div>
      </div>

      {/* 5-Stage Verification Sheet Breakdown */}
      <div className="mobile-card p-4 space-y-2 text-xs bg-muted/40">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Verifikasi 5 Tahap Material Intelligence</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          Poin terbit satu kali setelah seluruh tahap di bawah terkonfirmasi.
        </p>

        <div className="space-y-1.5 pt-1 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">1. Otorisasi QR Sesi Mesin</span>
            <span className="text-primary font-bold">✓ Sukses</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">2. Klasifikasi Visual CV</span>
            <span className="text-primary font-bold">✓ Sukses</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">3. Timbangan Load Cell HX711</span>
            <span className="text-primary font-bold">✓ Sukses</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">4. Aktuator Servo Diverter</span>
            <span className="text-primary font-bold">✓ Terkonfirmasi</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">5. Mutasi Poin Reward Ledger</span>
            <span className="text-primary font-bold">✓ 1x Terbit</span>
          </div>
        </div>
      </div>

      <Link
        to="/app"
        className="w-full mobile-btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
      >
        <Home className="w-4 h-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
};
