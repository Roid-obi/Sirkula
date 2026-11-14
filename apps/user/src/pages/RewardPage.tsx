import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER, MOCK_REWARD_ITEMS } from '@sirkula/api-client';
import { formatNumber } from '@sirkula/shared-utils';
import { ArrowLeft, Gift, Coins, CheckCircle2, AlertCircle, History, X } from 'lucide-react';
import { RewardItem } from '@sirkula/shared-types';

export const RewardPage: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(MOCK_USER.pointsBalance);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemSuccessCode, setRedeemSuccessCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRedeem = (item: RewardItem) => {
    setSelectedReward(item);
    setErrorMsg(null);
    setRedeemSuccessCode(null);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;

    if (balance < selectedReward.pointsRequired) {
      setErrorMsg('Maaf, saldo poin Anda belum mencukupi untuk menukar reward ini.');
      return;
    }

    setBalance((prev) => prev - selectedReward.pointsRequired);
    const code = `SRK-${selectedReward.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemSuccessCode(code);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-foreground">Katalog Reward</h1>
        </div>
        <Link
          to="/app/reward/history"
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          title="Riwayat Penukaran"
        >
          <History className="w-4 h-4" />
        </Link>
      </div>

      {/* Solid Points Wallet Card */}
      <div className="bg-emerald-700 text-white rounded-2xl p-4 shadow-card flex items-center justify-between">
        <div>
          <span className="text-[11px] text-emerald-100 font-medium block">Saldo Poin Anda</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black font-mono text-white">{formatNumber(balance)}</span>
            <span className="text-xs font-semibold text-emerald-200">Poin</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center">
          <Coins className="w-5 h-5" />
        </div>
      </div>

      {/* Catalog List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilihan Hadiah &amp; Voucher</h2>
        
        <div className="space-y-2.5">
          {MOCK_REWARD_ITEMS.map((item) => {
            const canAfford = balance >= item.pointsRequired;

            return (
              <div key={item.id} className="mobile-card p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full inline-block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xs font-bold text-foreground">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-sm font-bold font-mono text-primary block">
                      {formatNumber(item.pointsRequired)}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium">Poin</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="text-[11px] text-muted-foreground">Stok tersedia: {item.stock}</span>
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className={`py-1.5 px-4 rounded-xl text-xs font-bold transition ${
                      canAfford
                        ? 'mobile-btn-primary shadow-sm'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Tukarkan' : 'Poin Kurang'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solid Modal Dialog (No glassmorphism) */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedReward(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
            >
              <X className="w-4 h-4" />
            </button>

            {!redeemSuccessCode ? (
              <>
                <div className="text-center pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-2 border border-primary/20">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Konfirmasi Penukaran</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tukarkan <strong>{selectedReward.pointsRequired} Poin</strong> untuk:
                  </p>
                  <p className="text-sm font-extrabold text-primary mt-1">{selectedReward.title}</p>
                </div>

                {errorMsg && (
                  <div className="bg-destructive-soft text-destructive text-xs p-2.5 rounded-xl flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmRedeem}
                    className="flex-1 py-2.5 rounded-xl mobile-btn-primary text-xs font-bold shadow-sm"
                  >
                    Tukarkan
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-2 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto border border-primary/20">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Penukaran Berhasil!</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Tunjukkan kode voucher berikut ke kasir/mitra:</p>
                </div>
                <div className="bg-muted/60 border border-border p-3.5 rounded-2xl">
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">
                    Kode Voucher Digital
                  </span>
                  <span className="text-base font-mono font-bold text-foreground tracking-wider block mt-0.5">
                    {redeemSuccessCode}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-full py-2.5 rounded-xl mobile-btn-primary text-xs font-bold"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
