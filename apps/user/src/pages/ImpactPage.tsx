import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '@sirkula/api-client';
import { formatWeightKg } from '@sirkula/shared-utils';
import { ArrowLeft, Leaf, Recycle, Info } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const navigate = useNavigate();
  const user = MOCK_USER;

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
        <h1 className="text-base font-bold text-foreground">Dampak Sirkularitas</h1>
      </div>

      {/* Main Solid Metric Card */}
      <div className="bg-emerald-700 text-white rounded-2xl p-5 shadow-card space-y-2">
        <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-emerald-300" /> Kontribusi Terukur
        </div>
        <h2 className="text-3xl font-black font-mono text-white">{formatWeightKg(user.totalWeightKg)}</h2>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Total kemasan bernilai tinggi yang berhasil Anda kembalikan ke rantai pemulihan bersih Kampus UNS.
        </p>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="mobile-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-primary bg-primary-soft px-2 py-0.5 rounded-full inline-block">
            Material PET
          </span>
          <span className="text-2xl font-black font-mono text-foreground block">{user.totalPetCount}</span>
          <span className="text-xs text-muted-foreground">Botol Plastik Bersih</span>
        </div>

        <div className="mobile-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-primary bg-primary-soft px-2 py-0.5 rounded-full inline-block">
            Material Aluminium
          </span>
          <span className="text-2xl font-black font-mono text-foreground block">{user.totalAluCount}</span>
          <span className="text-xs text-muted-foreground">Kaleng Minuman</span>
        </div>
      </div>

      {/* Traceability Explanation */}
      <div className="mobile-card p-4 space-y-2.5 text-xs text-foreground bg-muted/40">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Recycle className="w-4 h-4 text-primary" />
          <span>Keterlacakan (Traceability) Batch Material</span>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Setiap kemasan yang Anda setorkan diagregasikan ke dalam identitas <strong>Batch Material</strong> di sistem pengelola sebelum diserahkan ke mitra daur ulang resmi (Bank Sampah Induk Surakarta &amp; PT Solo Daur Ulang Mandiri).
        </p>

        <div className="bg-card p-3 rounded-xl border border-border flex items-start gap-2 text-[11px] text-muted-foreground mt-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Sirkula berkomitmen hanya menampilkan metrik fisik yang terukur (jumlah unit &amp; berat kilogram) tanpa estimasi reduksi karbon semu yang belum tersertifikasi.
          </span>
        </div>
      </div>
    </div>
  );
};
