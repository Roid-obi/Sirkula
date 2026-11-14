import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatDateId } from '@sirkula/shared-utils';

export const RewardHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const redemptions = [
    {
      id: 'RDM-8941',
      title: 'Voucher Kantin UNS Rp10.000',
      points: 100,
      code: 'SRK-RWD01-7291',
      status: 'COMPLETED',
      createdAt: '2026-11-12T13:40:00Z'
    },
    {
      id: 'RDM-8940',
      title: 'Voucher Fotokopi & Print Rp5.000',
      points: 50,
      code: 'SRK-RWD04-1029',
      status: 'COMPLETED',
      createdAt: '2026-11-08T10:15:00Z'
    }
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <button
          onClick={() => navigate('/app/reward')}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Riwayat Penukaran Poin</h1>
      </div>

      <div className="space-y-2.5">
        {redemptions.map((r) => (
          <div key={r.id} className="mobile-card p-4 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground font-mono block">{r.id} · {formatDateId(r.createdAt)}</span>
                <h3 className="text-xs font-bold text-foreground mt-0.5">{r.title}</h3>
              </div>
              <span className="mobile-badge mobile-badge-success text-[10px] font-mono font-bold">
                -{r.points} Poin
              </span>
            </div>

            <div className="bg-muted/50 p-2.5 rounded-xl border border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Kode Voucher:</span>
              <span className="font-mono font-bold text-foreground tracking-wider">{r.code}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-primary font-medium pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Ditukarkan
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
