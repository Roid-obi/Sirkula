import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  RotateCcw,
  Sparkles,
  PackageCheck,
  Scale,
  Wallet,
  Cpu,
  ArrowUpRight,
  X,
  QrCode,
  Camera,
  GitBranch,
  Coins
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { useAdmin } from '../context/AdminContext';

interface DailyTrendItem {
  date: string;
  pet: number;
  alu: number;
  rejected: number;
}

const DAILY_TREND_14D: DailyTrendItem[] = [
  { date: '25 Okt', pet: 112, alu: 58, rejected: 9 },
  { date: '26 Okt', pet: 98, alu: 49, rejected: 7 },
  { date: '27 Okt', pet: 134, alu: 72, rejected: 11 },
  { date: '28 Okt', pet: 148, alu: 81, rejected: 10 },
  { date: '29 Okt', pet: 142, alu: 76, rejected: 8 },
  { date: '30 Okt', pet: 165, alu: 92, rejected: 12 },
  { date: '31 Okt', pet: 128, alu: 64, rejected: 6 },
  { date: '01 Nov', pet: 119, alu: 61, rejected: 7 },
  { date: '02 Nov', pet: 156, alu: 85, rejected: 9 },
  { date: '03 Nov', pet: 174, alu: 94, rejected: 11 },
  { date: '04 Nov', pet: 169, alu: 88, rejected: 8 },
  { date: '05 Nov', pet: 188, alu: 103, rejected: 10 },
  { date: '06 Nov', pet: 196, alu: 109, rejected: 9 },
  { date: '07 Nov', pet: 214, alu: 118, rejected: 11 }
];

export const DashboardPage: React.FC = () => {
  const {
    machines,
    transactions,
    theme,
    simulateLiveTransaction,
    resetDemoData
  } = useAdmin();

  const [currentTrendMode, setCurrentTrendMode] = useState<'unit' | 'kg'>('unit');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const splitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trendChartInstanceRef = useRef<Chart | null>(null);
  const splitChartInstanceRef = useRef<Chart | null>(null);

  // Formatting helpers matching duitin-sampah-hackathon
  const formatRupiah = (amount: number) => {
    const n = Math.round(Number(amount) || 0);
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatNumber = (num: number) => {
    const n = Number(num) || 0;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatKg = (num: number) => {
    return Number(num).toFixed(2).replace('.', ',') + ' kg';
  };

  // Metrics calculations
  const baselinePet = 2145;
  const baselineAlu = 1150;
  const baselineReward = 559500;
  const baselineRejected = 128;

  const extraAcceptedPet = transactions.filter(
    (t) => (t.status === 'ACCEPTED' || (t as any).status === 'accepted') && t.material === 'PET'
  ).length;
  const extraAcceptedAlu = transactions.filter(
    (t) => (t.status === 'ACCEPTED' || (t as any).status === 'accepted') && (t.material === 'ALUMINUM' || (t.material as any) === 'ALU')
  ).length;
  const extraRejected = transactions.filter(
    (t) => t.status === 'REJECTED' || (t as any).status === 'rejected'
  ).length;
  const extraReward = transactions
    .filter((t) => t.status === 'ACCEPTED' || (t as any).status === 'accepted')
    .reduce((sum, t) => sum + (t.rewardPoints ? t.rewardPoints * 10 : (t as any).rewardRp || 0), 0);

  const petUnits = baselinePet + extraAcceptedPet;
  const aluUnits = baselineAlu + extraAcceptedAlu;
  const acceptedUnits = petUnits + aluUnits;
  const rejectedUnits = baselineRejected + extraRejected;
  const totalTx = acceptedUnits + rejectedUnits + 2;
  const petKg = petUnits * 0.0195;
  const aluKg = aluUnits * 0.0142;
  const totalKg = petKg + aluKg;
  const totalRewardRp = baselineReward + extraReward;
  const acceptanceRatePct = ((acceptedUnits / totalTx) * 100).toFixed(1).replace('.', ',');

  const petPct = ((petUnits / acceptedUnits) * 100).toFixed(1).replace('.', ',');
  const aluPct = ((aluUnits / acceptedUnits) * 100).toFixed(1).replace('.', ',');

  // Palette helper matching duitin-sampah-hackathon
  const getPalette = () => {
    const isDark = theme === 'dark';
    return {
      textMuted: isDark ? '#a1a1aa' : '#71717a',
      textPrimary: isDark ? '#fafafa' : '#09090b',
      grid: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(9, 9, 11, 0.06)',
      tooltipBg: isDark ? '#18181b' : '#ffffff',
      tooltipBorder: isDark ? '#27272a' : '#e4e4e7',
      pet: isDark ? '#38bdf8' : '#0ea5e9',
      petFill: isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.12)',
      alu: isDark ? '#22c55e' : '#16a34a',
      aluFill: isDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(22, 163, 74, 0.13)'
    };
  };

  // Render Charts
  useEffect(() => {
    const palette = getPalette();

    // 1. Line Chart
    if (trendCanvasRef.current) {
      if (trendChartInstanceRef.current) {
        trendChartInstanceRef.current.destroy();
      }

      const labels = DAILY_TREND_14D.map((d) => d.date);
      const petData = DAILY_TREND_14D.map((d) =>
        currentTrendMode === 'unit' ? d.pet : Number((d.pet * 0.0195).toFixed(2))
      );
      const aluData = DAILY_TREND_14D.map((d) =>
        currentTrendMode === 'unit' ? d.alu : Number((d.alu * 0.0142).toFixed(2))
      );

      trendChartInstanceRef.current = new Chart(trendCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: currentTrendMode === 'unit' ? 'Botol PET (unit)' : 'Botol PET (kg)',
              data: petData,
              borderColor: palette.pet,
              backgroundColor: palette.petFill,
              borderWidth: 2,
              tension: 0.32,
              fill: true,
              pointRadius: 2.5,
              pointHoverRadius: 5
            },
            {
              label: currentTrendMode === 'unit' ? 'Kaleng Aluminium (unit)' : 'Kaleng Aluminium (kg)',
              data: aluData,
              borderColor: palette.alu,
              backgroundColor: palette.aluFill,
              borderWidth: 2,
              tension: 0.32,
              fill: true,
              pointRadius: 2.5,
              pointHoverRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: palette.tooltipBg,
              titleColor: palette.textPrimary,
              bodyColor: palette.textMuted,
              borderColor: palette.tooltipBorder,
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
              boxPadding: 4
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: palette.textMuted, font: { size: 11 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: palette.grid },
              ticks: { color: palette.textMuted, font: { size: 11 } }
            }
          }
        }
      });
    }

    // 2. Doughnut Chart
    if (splitCanvasRef.current) {
      if (splitChartInstanceRef.current) {
        splitChartInstanceRef.current.destroy();
      }

      splitChartInstanceRef.current = new Chart(splitCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Botol Plastik PET', 'Kaleng Aluminium'],
          datasets: [
            {
              data: [petUnits, aluUnits],
              backgroundColor: [palette.pet, palette.alu],
              borderColor: palette.tooltipBg,
              borderWidth: 3,
              hoverOffset: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: palette.tooltipBg,
              titleColor: palette.textPrimary,
              bodyColor: palette.textMuted,
              borderColor: palette.tooltipBorder,
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8
            }
          }
        }
      });
    }

    return () => {
      if (trendChartInstanceRef.current) trendChartInstanceRef.current.destroy();
      if (splitChartInstanceRef.current) splitChartInstanceRef.current.destroy();
    };
  }, [currentTrendMode, theme, petUnits, aluUnits]);

  // Status Badge Helper
  const renderStatusBadge = (status: string, label?: string) => {
    const isAccepted = status === 'ACCEPTED' || status === 'accepted';
    const isPending = status === 'PENDING' || status === 'pending';

    if (isAccepted) {
      return (
        <span className="badge badge-success">
          <span className="badge-dot" />
          {label || 'Diterima'}
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="badge badge-warning">
          <span className="badge-dot" />
          {label || 'Menunggu'}
        </span>
      );
    }
    return (
      <span className="badge badge-destructive">
        <span className="badge-dot" />
        {label || 'Ditolak'}
      </span>
    );
  };

  // Material Badge Helper
  const renderMaterialBadge = (material: string, label?: string) => {
    if (material === 'PET') return <span className="badge badge-info">PET</span>;
    if (material === 'ALUMINUM' || material === 'ALU')
      return <span className="badge badge-success">Aluminium</span>;
    return <span className="badge badge-outline">{label || 'Non-MVP'}</span>;
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ringkasan Operasional</h1>
          <p className="page-description">
            Metrik agregat pengumpulan material dan kinerja validasi sensor RVM di Kampus UNS.
          </p>
        </div>
        <div className="page-actions demo-only">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            id="btn-reset-demo"
            onClick={resetDemoData}
            title="Kembalikan data ke kondisi awal"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            id="btn-simulate-tx"
            onClick={simulateLiveTransaction}
          >
            <Sparkles size={14} />
            <span>Simulasi Transaksi</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <section className="grid-kpi" id="kpi-container">
        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Kemasan Terverifikasi</span>
            <span className="kpi-icon">
              <PackageCheck size={15} />
            </span>
          </div>
          <div className="kpi-value">
            {formatNumber(acceptedUnits)}{' '}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }} className="text-muted">
              unit
            </span>
          </div>
          <div className="kpi-sub">
            <span className="text-success font-medium">+128 unit</span>
            <span>hari ini</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Berat Terpilah</span>
            <span className="kpi-icon">
              <Scale size={15} />
            </span>
          </div>
          <div className="kpi-value">{formatKg(totalKg)}</div>
          <div className="kpi-sub">
            <span>Material bersih tervalidasi</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Saldo Reward Disalurkan</span>
            <span className="kpi-icon">
              <Wallet size={15} />
            </span>
          </div>
          <div className="kpi-value">{formatRupiah(totalRewardRp)}</div>
          <div className="kpi-sub">
            <span>1.130 klaim berhasil</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Tingkat Penerimaan</span>
            <span className="kpi-icon">
              <Cpu size={15} />
            </span>
          </div>
          <div className="kpi-value">{acceptanceRatePct}%</div>
          <div className="kpi-sub">
            <span>{formatNumber(rejectedUnits)} unit ditolak</span>
          </div>
        </div>
      </section>

      {/* Row 2: 14-Day Trend + Material Split */}
      <section className="grid-main-aside">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Tren Pengumpulan (14 Hari)</h2>
              <p className="card-description">Penerimaan harian kemasan PET dan Aluminium.</p>
            </div>
            <div className="tabs-list" id="trend-mode-tabs">
              <button
                type="button"
                className={`tab-trigger ${currentTrendMode === 'unit' ? 'active' : ''}`}
                onClick={() => setCurrentTrendMode('unit')}
              >
                Unit
              </button>
              <button
                type="button"
                className={`tab-trigger ${currentTrendMode === 'kg' ? 'active' : ''}`}
                onClick={() => setCurrentTrendMode('kg')}
              >
                Berat (kg)
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-box">
              <canvas ref={trendCanvasRef} />
            </div>
          </div>
          <div className="card-footer">
            <div className="row-gap">
              <span className="row-gap-sm text-xs">
                <span className="legend-dot pet" /> PET (Rp100/unit)
              </span>
              <span className="row-gap-sm text-xs">
                <span className="legend-dot alu" /> Aluminium (Rp300/unit)
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Proporsi Material</h2>
              <p className="card-description">Komposisi material terpilah.</p>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-box-sm" style={{ height: '190px' }}>
              <canvas ref={splitCanvasRef} />
            </div>
            <div className="kv-list" style={{ marginTop: '0.9rem' }}>
              <div className="kv-row">
                <span className="row-gap-sm">
                  <span className="legend-dot pet" /> Botol PET ({petPct}%)
                </span>
                <span className="kv-val mono">{formatNumber(petUnits)} unit</span>
              </div>
              <div className="kv-row">
                <span className="row-gap-sm">
                  <span className="legend-dot alu" /> Aluminium ({aluPct}%)
                </span>
                <span className="kv-val mono">{formatNumber(aluUnits)} unit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Recent Transactions + Machine Quick Status */}
      <section className="grid-main-aside">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Aktivitas Transaksi Terbaru</h2>
              <p className="card-description">Log penyetoran kemasan dan hasil verifikasi multi-modal.</p>
            </div>
            <NavLink to="/transaksi" className="btn btn-outline btn-sm">
              <span>Semua Transaksi</span>
              <ArrowUpRight size={14} />
            </NavLink>
          </div>
          <div className="card-content">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID &amp; Waktu</th>
                    <th>Pengguna</th>
                    <th>Mesin</th>
                    <th>Material</th>
                    <th>Status</th>
                    <th className="text-right">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx: any) => {
                    const timePart = tx.timestamp.includes(', ')
                      ? tx.timestamp.split(', ')[1]
                      : new Date(tx.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        });

                    const rewardValue = tx.rewardRp || (tx.rewardPoints ? tx.rewardPoints * 10 : 0);

                    return (
                      <tr
                        key={tx.id}
                        className="clickable"
                        onClick={() => setSelectedTx(tx)}
                      >
                        <td>
                          <span className="mono font-medium">{tx.id}</span>
                          <span className="text-xs text-muted" style={{ marginLeft: '0.35rem' }}>
                            {timePart}
                          </span>
                        </td>
                        <td className="font-medium">{tx.user || tx.userName}</td>
                        <td>
                          <span className="text-xs text-muted">
                            {(tx.machineName || '').replace(' UNS', '')}
                          </span>
                        </td>
                        <td>{renderMaterialBadge(tx.material, tx.materialLabel)}</td>
                        <td>{renderStatusBadge(tx.status, tx.statusLabel)}</td>
                        <td className="text-right mono font-semibold">
                          {rewardValue > 0 ? '+' + formatRupiah(rewardValue) : 'Rp0'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Status Unit RVM</h2>
              <p className="card-description">Kapasitas wadah &amp; jaringan mesin.</p>
            </div>
            <NavLink to="/mesin" className="btn btn-outline btn-sm">
              Detail
            </NavLink>
          </div>
          <div className="card-content stack" style={{ gap: '0.85rem' }}>
            {machines.map((m) => {
              const totalCount = m.petCount + m.aluCount;
              const totalCap = m.petCap + m.aluCap;
              const totalPct = Math.round((totalCount / totalCap) * 100);

              let badgeClass = 'badge-success';
              if (m.status === 'warning') badgeClass = 'badge-warning';
              if (m.status === 'offline') badgeClass = 'badge-destructive';

              return (
                <div
                  key={m.id}
                  style={{
                    padding: '0.65rem 0.8rem',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    background: 'hsl(var(--card))'
                  }}
                >
                  <div className="row-between">
                    <span className="font-medium text-sm">{m.name}</span>
                    <span className={`badge ${badgeClass}`}>
                      <span className="badge-dot" />
                      {m.statusLabel}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.45rem' }}>
                    <div className="row-between text-xs mono text-muted" style={{ marginBottom: '3px' }}>
                      <span>Kapasitas: {totalPct}%</span>
                      <span>
                        {totalCount}/{totalCap} unit
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}`}
                        style={{ width: `${totalPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Slide-over Sheet for Transaction Verification Detail - Exact duitin-sampah-hackathon */}
      {selectedTx && (
        <>
          <div
            className="sheet-backdrop open"
            id="tx-sheet-backdrop"
            onClick={() => setSelectedTx(null)}
          />
          <aside className="sheet-panel open" id="tx-sheet-panel" aria-hidden="false">
            <div className="sheet-header">
              <div>
                <div className="row-gap-sm">
                  <h3 className="card-title mono" id="sheet-tx-id">
                    {selectedTx.id}
                  </h3>
                  <span id="sheet-tx-badge">
                    {renderStatusBadge(selectedTx.status, selectedTx.statusLabel)}
                  </span>
                </div>
                <p className="card-description" id="sheet-tx-time">
                  {selectedTx.timestamp} · {selectedTx.machineId} ({selectedTx.machineName})
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                id="btn-close-sheet"
                aria-label="Tutup panel"
                onClick={() => setSelectedTx(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="sheet-body" id="sheet-tx-body">
              <div className="kv-list">
                <div className="kv-row">
                  <span className="kv-key">Pengguna</span>
                  <span className="kv-val">
                    {selectedTx.user || selectedTx.userName}{' '}
                    <span className="mono text-muted">
                      ({selectedTx.userNim || selectedTx.userId || 'M0523041'})
                    </span>
                  </span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Idempotency Key</span>
                  <span className="kv-val mono text-xs">{selectedTx.idempotencyKey}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Kategori Terdeteksi</span>
                  <span className="kv-val">{selectedTx.materialLabel}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Reward Virtual</span>
                  <span className="kv-val mono font-semibold">
                    {(selectedTx.rewardRp || selectedTx.rewardPoints) > 0
                      ? '+' +
                        formatRupiah(selectedTx.rewardRp || (selectedTx.rewardPoints ? selectedTx.rewardPoints * 10 : 0))
                      : 'Rp0 (Tidak diberikan)'}
                  </span>
                </div>
              </div>

              <div>
                <div className="label" style={{ marginBottom: '0.65rem' }}>
                  Alur Verifikasi Material Intelligence
                </div>
                <div className="pipeline-steps">
                  <div className="pipeline-step">
                    <div className="pipeline-dot ok">
                      <QrCode size={14} />
                    </div>
                    <div className="pipeline-info">
                      <div className="pipeline-title">
                        <span>1. Sesi QR Mesin Valid</span>
                        <span className="mono text-xs text-muted">OK</span>
                      </div>
                      <div className="pipeline-desc">
                        Sesi pengguna terhubung dengan unit {selectedTx.machineId}.
                      </div>
                    </div>
                  </div>

                  <div className="pipeline-step">
                    <div
                      className={`pipeline-dot ${
                        selectedTx.material !== 'UNKNOWN' &&
                        (selectedTx.aiConfidence >= 75 || selectedTx.aiConfidence >= 0.75)
                          ? 'ok'
                          : 'fail'
                      }`}
                    >
                      <Camera size={14} />
                    </div>
                    <div className="pipeline-info">
                      <div className="pipeline-title">
                        <span>2. Klasifikasi Computer Vision</span>
                        <span className="mono text-xs">
                          {selectedTx.aiConfidence > 1
                            ? `${selectedTx.aiConfidence}%`
                            : `${Math.round(selectedTx.aiConfidence * 100)}%`}
                        </span>
                      </div>
                      <div className="pipeline-desc">Hasil model: {selectedTx.materialLabel}.</div>
                    </div>
                  </div>

                  <div className="pipeline-step">
                    <div
                      className={`pipeline-dot ${
                        selectedTx.status !== 'REJECTED' && selectedTx.status !== 'rejected'
                          ? 'ok'
                          : 'fail'
                      }`}
                    >
                      <Scale size={14} />
                    </div>
                    <div className="pipeline-info">
                      <div className="pipeline-title">
                        <span>3. Pemeriksaan Fisik Sensor</span>
                        <span className="mono text-xs">
                          {selectedTx.weightGram || selectedTx.weightG} g
                        </span>
                      </div>
                      <div className="pipeline-desc">
                        {selectedTx.sensorCheck ||
                          (selectedTx.status === 'REJECTED' || selectedTx.status === 'rejected'
                            ? 'Gagal (>45 g, indikasi cairan)'
                            : 'Valid (12–45 g, kosong)')}
                      </div>
                    </div>
                  </div>

                  <div className="pipeline-step">
                    <div
                      className={`pipeline-dot ${
                        selectedTx.servoConfirm !== false &&
                        selectedTx.status !== 'REJECTED' &&
                        selectedTx.status !== 'rejected'
                          ? 'ok'
                          : selectedTx.status === 'PENDING'
                          ? 'wait'
                          : 'fail'
                      }`}
                    >
                      <GitBranch size={14} />
                    </div>
                    <div className="pipeline-info">
                      <div className="pipeline-title">
                        <span>4. Aktuator Pemilah &amp; Konfirmasi</span>
                        <span className="mono text-xs">
                          {selectedTx.servoConfirm
                            ? 'ACK'
                            : selectedTx.status === 'PENDING'
                            ? 'WAIT'
                            : 'NACK'}
                        </span>
                      </div>
                      <div className="pipeline-desc">
                        Tujuan mekanik:{' '}
                        {selectedTx.sortingBin ||
                          (selectedTx.material === 'PET'
                            ? 'Wadah PET #A'
                            : selectedTx.material === 'ALUMINUM' || selectedTx.material === 'ALU'
                            ? 'Wadah Aluminium #B'
                            : 'Jalur Tolak / Retur')}
                        .
                      </div>
                    </div>
                  </div>

                  <div className="pipeline-step">
                    <div
                      className={`pipeline-dot ${
                        (selectedTx.rewardRp || selectedTx.rewardPoints) > 0 ? 'ok' : 'fail'
                      }`}
                    >
                      <Coins size={14} />
                    </div>
                    <div className="pipeline-info">
                      <div className="pipeline-title">
                        <span>5. Pencatatan Saldo Virtual</span>
                        <span className="mono text-xs">
                          {(selectedTx.rewardRp || selectedTx.rewardPoints) > 0
                            ? '+' +
                              formatRupiah(
                                selectedTx.rewardRp || (selectedTx.rewardPoints ? selectedTx.rewardPoints * 10 : 0)
                              )
                            : 'Rp0'}
                        </span>
                      </div>
                      <div className="pipeline-desc">
                        {selectedTx.note ||
                          ((selectedTx.rewardRp || selectedTx.rewardPoints) > 0
                            ? 'Konfirmasi pemilahan diterima oleh backend, saldo virtual diperbarui.'
                            : 'Tidak ada saldo yang diterbitkan karena transaksi gagal/ditolak.')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sheet-footer">
              <NavLink to="/transaksi" className="btn btn-outline btn-sm">
                Buka Manajemen Transaksi
              </NavLink>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                id="btn-close-sheet-footer"
                onClick={() => setSelectedTx(null)}
              >
                Tutup
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
