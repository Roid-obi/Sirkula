import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_MACHINES } from '@sirkula/api-client';
import { SessionStep } from '@sirkula/shared-types';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const SessionPage: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const machineId = searchParams.get('machine') || 'RVM-UNS-01';
  const machine = MOCK_MACHINES.find((m) => m.id === machineId) || MOCK_MACHINES[0];

  const [step, setStep] = useState<SessionStep>('WAITING_INSERT');
  const [material, setMaterial] = useState<'PET' | 'ALUMINUM' | 'UNKNOWN'>('PET');
  const [weightG, setWeightG] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [awardedPoints, setAwardedPoints] = useState<number>(0);
  const [rejectReason, setRejectReason] = useState<string>('');

  const simulateDeposit = (type: 'PET' | 'ALUMINUM' | 'UNKNOWN') => {
    setStep('OBJECT_DETECTED');
    setMaterial(type);

    setTimeout(() => {
      setStep('AI_INSPECTING');
      if (type === 'PET') {
        setConfidence(0.96);
      } else if (type === 'ALUMINUM') {
        setConfidence(0.94);
      } else {
        setConfidence(0.35);
      }
    }, 1100);

    setTimeout(() => {
      setStep('WEIGHT_MEASURING');
      if (type === 'PET') {
        setWeightG(19.4);
      } else if (type === 'ALUMINUM') {
        setWeightG(14.8);
      } else {
        setWeightG(175.2);
      }
    }, 2200);

    setTimeout(() => {
      setStep('VALIDATING');
    }, 3300);

    setTimeout(() => {
      setStep('SORTING_ACTUATING');
    }, 4400);

    setTimeout(() => {
      if (type === 'PET') {
        setAwardedPoints(10);
        setStep('COMPLETED');
      } else if (type === 'ALUMINUM') {
        setAwardedPoints(20);
        setStep('COMPLETED');
      } else {
        setAwardedPoints(0);
        setRejectReason('Kemasan terdeteksi berisi sisa cairan / di luar batas rentang kosong.');
        setStep('REJECTED');
      }
    }, 5500);
  };

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
        <div>
          <h1 className="text-base font-bold text-foreground">Sesi Setor RVM</h1>
          <span className="text-[10px] text-muted-foreground font-mono">{sessionId}</span>
        </div>
      </div>

      {/* Machine Status Card */}
      <div className="mobile-card p-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="mobile-badge mobile-badge-success text-[10px] font-mono">
            SESI TERHUBUNG
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">{machine.id}</span>
        </div>
        <h2 className="text-sm font-bold text-foreground">{machine.name}</h2>
        <p className="text-xs text-muted-foreground">{machine.zone}</p>
      </div>

      {/* Main Interactive Stage Box (Solid White / Card Surface) */}
      <div className="mobile-card p-5 text-center space-y-4">
        {step === 'WAITING_INSERT' && (
          <div className="space-y-3 py-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto border border-primary/20 animate-pulse">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Menunggu Kemasan Dimasukkan</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Silakan masukkan 1 botol PET atau kaleng aluminium kosong ke pintu masuk RVM.
              </p>
            </div>
          </div>
        )}

        {(step === 'OBJECT_DETECTED' ||
          step === 'AI_INSPECTING' ||
          step === 'WEIGHT_MEASURING' ||
          step === 'VALIDATING' ||
          step === 'SORTING_ACTUATING') && (
          <div className="space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto border border-primary/20">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {step === 'OBJECT_DETECTED' && 'Objek Terdeteksi di Lubang'}
                {step === 'AI_INSPECTING' && 'AI Memeriksa Visual Kemasan...'}
                {step === 'WEIGHT_MEASURING' && 'Sensor Membaca Berat Kosong...'}
                {step === 'VALIDATING' && 'Memvalidasi Kriteria Multi-Modal...'}
                {step === 'SORTING_ACTUATING' && 'Servo Diverter Mengarahkan...'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Memproses verifikasi otomatis...</p>
            </div>

            {/* Live Measurements Display */}
            <div className="grid grid-cols-2 gap-2 text-left bg-muted/50 p-3 rounded-xl border border-border text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Prediksi AI (Vision)</span>
                <strong className="text-foreground font-mono">
                  {confidence > 0 ? `${material} (${Math.round(confidence * 100)}%)` : 'Scanning...'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Sensor HX711</span>
                <strong className="text-foreground font-mono">
                  {weightG > 0 ? `${weightG.toFixed(1)}g` : 'Menimbang...'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {step === 'COMPLETED' && (
          <div className="space-y-3 py-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto border border-primary/20">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <span className="mobile-badge mobile-badge-success text-[10px] uppercase font-bold">
                Kemasan Diterima &amp; Tersortir
              </span>
              <h2 className="text-2xl font-black font-mono text-foreground mt-1">+{awardedPoints} Poin</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {material === 'PET' ? 'Botol Plastik PET' : 'Kaleng Aluminium'} ({weightG}g) berhasil diterima.
              </p>
            </div>

            <div className="bg-primary-soft/40 border border-primary/20 rounded-xl p-3 text-xs text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Pencatatan Idempoten Satu Kali</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Poin telah otomatis ditambahkan ke saldo akun Anda.
              </p>
            </div>

            <button
              onClick={() => navigate(`/app/transaction/TXN-UNS-${Date.now().toString().slice(-5)}`)}
              className="w-full mobile-btn-primary py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              Lihat Bukti Transaksi <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'REJECTED' && (
          <div className="space-y-3 py-3">
            <div className="w-14 h-14 rounded-2xl bg-destructive-soft text-destructive flex items-center justify-center mx-auto border border-destructive/20">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <span className="mobile-badge mobile-badge-danger text-[10px] uppercase font-bold">
                Kemasan Ditolak (Reject)
              </span>
              <h2 className="text-xl font-bold font-mono text-foreground mt-1">0 Poin Diterbitkan</h2>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs mx-auto">
                {rejectReason}
              </p>
            </div>

            <div className="bg-warning-soft/40 border border-warning/20 rounded-xl p-3 text-xs text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-warning-foreground">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span>Kemasan Dialihkan ke Pintu Reject</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Silakan ambil kembali kemasan Anda di lubang pengembalian reject. Kosongkan sisa cairan sebelum mencoba lagi.
              </p>
            </div>

            <button
              onClick={() => setStep('WAITING_INSERT')}
              className="w-full mobile-btn-secondary py-3 rounded-xl text-xs font-bold"
            >
              Coba Masukkan Kemasan Lain
            </button>
          </div>
        )}
      </div>

      {/* Interactive Simulation Controls */}
      <div className="mobile-card p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Panel Simulasi Sensor &amp; AI
          </span>
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">Demo Control</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Pilih skenario di bawah untuk menguji respons multi-modal RVM:
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            onClick={() => simulateDeposit('PET')}
            disabled={step !== 'WAITING_INSERT' && step !== 'COMPLETED' && step !== 'REJECTED'}
            className="w-full mobile-card hover:border-primary/40 p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition disabled:opacity-50"
          >
            <span className="text-foreground">🍾 Skenario A: Botol Plastik PET (+10 Poin)</span>
            <span className="mobile-badge mobile-badge-success text-[10px]">Sukses</span>
          </button>

          <button
            onClick={() => simulateDeposit('ALUMINUM')}
            disabled={step !== 'WAITING_INSERT' && step !== 'COMPLETED' && step !== 'REJECTED'}
            className="w-full mobile-card hover:border-primary/40 p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition disabled:opacity-50"
          >
            <span className="text-foreground">🥫 Skenario B: Kaleng Aluminium (+20 Poin)</span>
            <span className="mobile-badge mobile-badge-success text-[10px]">Sukses</span>
          </button>

          <button
            onClick={() => simulateDeposit('UNKNOWN')}
            disabled={step !== 'WAITING_INSERT' && step !== 'COMPLETED' && step !== 'REJECTED'}
            className="w-full mobile-card hover:border-destructive/40 p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition disabled:opacity-50"
          >
            <span className="text-foreground">⚠️ Skenario C: Botol Masih Berisi Air (Reject)</span>
            <span className="mobile-badge mobile-badge-danger text-[10px]">Tolak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
