import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_MACHINES } from '@sirkula/api-client';
import { ArrowLeft, Flashlight, Camera, Check, AlertCircle, Sparkles } from 'lucide-react';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedMachineId = searchParams.get('machine');

  const [manualCode, setManualCode] = useState(preselectedMachineId || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [flashOn, setFlashOn] = useState(false);

  const handleSelectMachine = (machineId: string) => {
    navigate(`/app/session/SES-${machineId}-${Date.now().toString().slice(-4)}?machine=${machineId}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = manualCode.trim().toUpperCase();
    const machine = MOCK_MACHINES.find((m) => m.id === cleanCode);

    if (!machine) {
      setErrorMsg(`Mesin "${cleanCode}" tidak ditemukan.`);
      return;
    }

    if (machine.status === 'offline') {
      setErrorMsg(`Mesin "${machine.name}" sedang offline.`);
      return;
    }

    handleSelectMachine(machine.id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-4 pb-8 max-w-md mx-auto">
      {/* Native Top App Bar */}
      <div className="flex items-center justify-between pt-2 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 transition flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-400">
          Pindai QR Mesin
        </span>
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            flashOn ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Solid Camera Viewfinder Area */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative w-64 h-64 border-2 border-emerald-500 rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-900 shadow-2xl">
          {/* Corner Brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />

          {/* Solid Laser scan bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400 animate-pulse" />

          <div className="text-center p-4">
            <Camera className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs text-zinc-300 font-medium">Arahkan kamera ke QR Code di layar RVM</p>
          </div>
        </div>

        {/* Demo Fast Selector Pills */}
        <div className="mt-5 w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2">
          <span className="text-[10px] uppercase font-bold font-mono text-emerald-400 block tracking-wider">
            Simulasi Pindai Cepat (Demo):
          </span>
          <div className="space-y-1.5">
            {MOCK_MACHINES.slice(0, 2).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectMachine(m.id)}
                className="w-full text-left bg-zinc-800 hover:bg-emerald-900/60 p-2.5 rounded-xl text-xs flex items-center justify-between transition border border-zinc-700/50"
              >
                <div>
                  <strong className="block text-white font-medium">{m.name}</strong>
                  <span className="text-[10px] text-zinc-400 font-mono">{m.id} · {m.zone}</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Input Fallback (Solid Zinc Surface) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
        <span className="text-[11px] text-zinc-300 font-medium block">
          Kendala kamera? Masukkan ID Mesin manual:
        </span>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => {
              setManualCode(e.target.value);
              setErrorMsg('');
            }}
            placeholder="Contoh: RVM-UNS-01"
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 uppercase tracking-wider focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0"
          >
            Hubungkan
          </button>
        </form>

        {errorMsg && (
          <div className="text-red-400 text-[11px] flex items-center gap-1.5 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
