import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  ArrowLeftRight,
  BarChart3,
  Coins,
  Truck,
  ShieldAlert,
  LogOut,
  Sun,
  Moon,
  PanelLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLayout: React.FC = () => {
  const {
    machines,
    anomalies,
    theme,
    toggleTheme,
    toasts,
    dismissToast
  } = useAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const openAnomalies = anomalies.filter(
    (a: any) => a.actionStatus === 'Dibuka' || (a.status && a.status !== 'RESOLVED')
  ).length;

  const onlineMachines = machines.filter((m) => m.status !== 'offline').length || 3;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Ringkasan Operasional';
      case '/mesin':
        return 'Monitoring Mesin';
      case '/peta':
        return 'Peta Sebaran RVM';
      case '/transaksi':
        return 'Manajemen Transaksi';
      case '/analitik':
        return 'Analitik Material';
      case '/reward':
        return 'Manajemen Reward';
      case '/pengumpulan':
        return 'Pengumpulan & Batch';
      case '/anomali':
        return 'Deteksi Anomali';
      default:
        return 'Ringkasan';
    }
  };

  interface NavItem {
    id: string;
    title: string;
    path: string;
    icon: any;
    machineCount?: boolean;
    alertCount?: boolean;
  }

  interface NavGroup {
    label: string;
    items: NavItem[];
  }

  const NAV_GROUPS: NavGroup[] = [
    {
      label: 'Operasional Utama',
      items: [
        { id: 'dashboard', title: 'Ringkasan', path: '/dashboard', icon: LayoutDashboard },
        { id: 'mesin', title: 'Monitoring Mesin', path: '/mesin', icon: Cpu, machineCount: true },
        { id: 'transaksi', title: 'Manajemen Transaksi', path: '/transaksi', icon: ArrowLeftRight },
        { id: 'analitik', title: 'Analitik Material', path: '/analitik', icon: BarChart3 }
      ]
    },
    {
      label: 'Tata Kelola & Keterlacakan',
      items: [
        { id: 'reward', title: 'Manajemen Reward', path: '/reward', icon: Coins },
        { id: 'pengumpulan', title: 'Pengumpulan & Batch', path: '/pengumpulan', icon: Truck },
        { id: 'anomali', title: 'Deteksi Anomali', path: '/anomali', icon: ShieldAlert, alertCount: true }
      ]
    }
  ];

  return (
    <div className="app-shell">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="sheet-backdrop open"
          style={{ zIndex: 25 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Matching duitin-sampah-hackathon */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`} id="app-sidebar">
        <div className="sidebar-header">
          <img src="/logo.svg" alt="Logo Sirkula" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name">Sirkula Intelligence</span>
            <span className="brand-sub">Admin &amp; Material Hub</span>
          </div>
        </div>

        <div className="sidebar-content">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              <ul className="nav-list">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="nav-link-left">
                          <Icon size={16} />
                          <span>{item.title}</span>
                        </span>
                        {item.alertCount && openAnomalies > 0 ? (
                          <span className="nav-count nav-count-danger">{openAnomalies}</span>
                        ) : item.machineCount ? (
                          <span className="nav-count nav-count-success">{onlineMachines}</span>
                        ) : null}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">SR</div>
            <div className="admin-meta">
              <div className="admin-name">Operator Kampus UNS</div>
              <div className="admin-role">admin@sirkula.id</div>
            </div>
          </div>
          <NavLink to="/login" className="btn btn-ghost btn-icon" title="Keluar ke halaman Login">
            <LogOut size={16} />
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        {/* Topbar - Matching duitin-sampah-hackathon */}
        <header className="app-topbar" id="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="btn btn-ghost btn-icon mobile-menu-btn"
              id="btn-mobile-menu"
              aria-label="Buka navigasi"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <PanelLeft size={16} />
            </button>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <span>Sirkula Admin</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </nav>
          </div>

          <div className="topbar-right">
            <span className="badge badge-outline" title="Prototipe UNS Innovation Hackathon 2026">
              <span className="badge-dot" style={{ color: 'hsl(var(--primary))' }} />
              Data Ilustrasi Prototipe
            </span>

            <button
              type="button"
              className="btn btn-outline btn-icon"
              id="btn-theme-toggle"
              title="Ganti tema Terang / Gelap"
              aria-label="Ganti tema"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Page Container */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="toast-container" id="toast-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="toast"
              onClick={() => dismissToast(toast.id)}
              style={{ cursor: 'pointer' }}
            >
              {toast.type === 'error' ? (
                <X size={18} style={{ color: 'hsl(var(--destructive))' }} />
              ) : toast.type === 'warning' ? (
                <AlertTriangle size={18} style={{ color: 'hsl(var(--warning))' }} />
              ) : toast.type === 'info' ? (
                <Info size={18} style={{ color: 'hsl(var(--info))' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: 'hsl(var(--primary))' }} />
              )}
              <div>
                <div className="toast-title">{toast.title}</div>
                {toast.description && <div className="toast-desc">{toast.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
