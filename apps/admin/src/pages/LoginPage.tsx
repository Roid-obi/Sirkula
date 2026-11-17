import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  ShieldCheck,
  Coins,
  Truck,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, showToast } = useAdmin();

  const [email, setEmail] = useState('admin@sirkula.id');
  const [password, setPassword] = useState('sirkula2026');
  const [zone, setZone] = useState('uns');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Masuk Berhasil', 'Selamat datang di Panel Sirkula Intelligence.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="login-shell">
      {/* Left Column: Product Thesis & Material Intelligence */}
      <aside className="login-showcase">
        <div className="showcase-top row-between">
          <div className="row-gap-sm">
            <img
              src="/logo.svg"
              alt="Sirkula Intelligence"
              className="brand-logo"
              style={{ width: '34px', height: '34px' }}
            />
            <div>
              <div className="brand-name" style={{ fontSize: '1rem' }}>
                Sirkula Intelligence
              </div>
              <div className="brand-sub">Smart Beverage Container Recovery Ecosystem</div>
            </div>
          </div>
          <span className="badge badge-success">UNS Innovation Hackathon 2026</span>
        </div>

        <div className="showcase-mid">
          <span className="badge badge-outline">Material Intelligence Platform</span>
          <h1 className="showcase-headline">
            Mengubah kemasan minuman bekas menjadi material ekonomi yang terlacak.
          </h1>
          <p className="showcase-lead">
            Panel kendali terpadu untuk memantau unit Smart Reverse Vending Machine (RVM),
            memverifikasi penerimaan botol PET &amp; kaleng aluminium berbasis AI + sensor fisik,
            serta mengelola keterlacakan penyaluran material.
          </p>

          <div className="pillar-grid">
            <div className="pillar-item">
              <div className="pillar-title">
                <Scan size={14} /> Multi-Modal Verification
              </div>
              <div className="pillar-desc">
                Klasifikasi computer vision dipadukan pemeriksaan berat load cell &amp; sensor objek.
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-title">
                <ShieldCheck size={14} /> Konfirmasi Anti-Ganda
              </div>
              <div className="pillar-desc">
                Saldo virtual hanya cair setelah aktuator pemilah mengonfirmasi ID transaksi unik.
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-title">
                <Coins size={14} /> Valuasi Terukur
              </div>
              <div className="pillar-desc">
                Aturan insentif PET &amp; Aluminium yang diselaraskan terhadap margin operasional.
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-title">
                <Truck size={14} /> Keterlacakan Batch
              </div>
              <div className="pillar-desc">
                Pencatatan digital dari mesin kampus hingga penyaluran ke mitra daur ulang.
              </div>
            </div>
          </div>
        </div>

        <div className="showcase-bottom row-between text-xs text-muted">
          <span>Fokus Prototipe MVP: Botol Plastik PET &amp; Kaleng Aluminium</span>
          <span className="mono">v0.9-prototype</span>
        </div>
      </aside>

      {/* Right Column: Admin Sign-In Form */}
      <main className="login-panel">
        <div className="login-topbar">
          <button
            type="button"
            className="btn btn-outline btn-icon"
            id="login-theme-btn"
            title="Ganti tema Terang / Gelap"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div className="card login-card">
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div>
              <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
                Masuk ke Panel Pengelola
              </h2>
              <p className="card-description">
                Gunakan akun operator Sirkula untuk mengakses dashboard pemantauan mesin dan
                transaksi.
              </p>
            </div>
          </div>

          <div className="card-content pt">
            <form onSubmit={handleLogin} className="stack">
              <div className="field">
                <label className="label" htmlFor="email">
                  Email Operator
                </label>
                <input
                  className="input"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <div className="row-between">
                  <label className="label" htmlFor="password">
                    Kata Sandi
                  </label>
                  <span className="text-xs text-muted">Sesi Prototipe</span>
                </div>
                <input
                  className="input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="zone">
                  Wilayah Operasional
                </label>
                <select
                  className="select"
                  id="zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  <option value="uns">Klaster Kampus UNS Kentingan (MVP)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.25rem' }}
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          <div className="card-footer" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <span>Prototipe antarmuka untuk dokumentasi proposal — tanpa autentikasi eksternal.</span>
          </div>
        </div>
      </main>
    </div>
  );
};
