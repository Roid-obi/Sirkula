import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_TRANSACTIONS } from '@sirkula/api-client';
import { formatDateId } from '@sirkula/shared-utils';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const filtered = MOCK_TRANSACTIONS.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-4 p-4">
      {/* Native App Bar */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <button
          onClick={() => navigate('/app')}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Riwayat Penyetoran</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
            filter === 'ALL'
              ? 'bg-primary text-primary-foreground font-bold shadow-sm'
              : 'mobile-card text-muted-foreground hover:bg-muted'
          }`}
        >
          Semua ({MOCK_TRANSACTIONS.length})
        </button>
        <button
          onClick={() => setFilter('ACCEPTED')}
          className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
            filter === 'ACCEPTED'
              ? 'bg-primary text-primary-foreground font-bold shadow-sm'
              : 'mobile-card text-muted-foreground hover:bg-muted'
          }`}
        >
          Diterima
        </button>
        <button
          onClick={() => setFilter('REJECTED')}
          className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
            filter === 'REJECTED'
              ? 'bg-primary text-primary-foreground font-bold shadow-sm'
              : 'mobile-card text-muted-foreground hover:bg-muted'
          }`}
        >
          Ditolak
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filtered.map((tx) => (
          <Link
            key={tx.id}
            to={`/app/transaction/${tx.id}`}
            className="mobile-card p-3 flex items-center justify-between hover:border-primary/40 active:scale-99 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                  tx.status === 'ACCEPTED'
                    ? 'bg-primary-soft text-primary'
                    : 'bg-destructive-soft text-destructive'
                }`}
              >
                {tx.material === 'PET' ? 'PET' : tx.material === 'ALUMINUM' ? 'ALU' : 'UNK'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">{tx.materialLabel}</h3>
                <span className="text-[11px] text-muted-foreground block">
                  {tx.machineName} · {tx.weightG}g
                </span>
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  {formatDateId(tx.timestamp)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  ) : (
                    <XCircle className="w-3 h-3 text-destructive" />
                  )}
                  {tx.status === 'ACCEPTED' ? 'Sukses' : 'Ditolak'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
