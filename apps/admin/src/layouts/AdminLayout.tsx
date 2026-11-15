import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  MapPin,
  ArrowLeftRight,
  BarChart3,
  Coins,
  Truck,
  ShieldAlert,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  RotateCcw,
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
    simulateLiveTransaction,
    resetDemoData,
    toasts,
    dismissToast
  } = useAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const openAnomaliesCount = anomalies.filter((a: any) =>
    a.actionStatus ? a.actionStatus === 'Dibuka' : a.status !== 'RESOLVED'
  ).length;
  const onlineMachinesCount = machines.filter((m) => m.status !== 'offline').length;

  interface NavItem {
    id: string;
    title: string;
    path: string;
    icon: any;
    badge: string | null;
    badgeDanger?: boolean;
  }

  interface NavSection {
    label: string;
    items: NavItem[];
  }

  const NAV_SECTIONS: NavSection[] = [
    {
      label: 'Operasional Utama',
      items: [
        {
          id: 'dashboard',
          title: 'Ringkasan',
          path: '/dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'mesin',
          title: 'Monitoring Mesin',
          path: '/mesin',
          icon: Cpu,
          badge: `${onlineMachinesCount}/${machines.length}`
        },
        {
          id: 'peta',
          title: 'Peta Sebaran RVM',
          path: '/peta',
          icon: MapPin,
          badge: null
        },
        {
          id: 'transaksi',
          title: 'Manajemen Transaksi',
          path: '/transaksi',
          icon: ArrowLeftRight,
          badge: null
        },
        {
          id: 'analitik',
          title: 'Analitik Material',
          path: '/analitik',
          icon: BarChart3,
          badge: null
        }
      ]
    },
    {
      label: 'Tata Kelola & Keterlacakan',
      items: [
        {
          id: 'reward',
          title: 'Manajemen Reward',
          path: '/reward',
          icon: Coins,
          badge: null
        },
        {
          id: 'pengumpulan',
          title: 'Pengumpulan & Batch',
          path: '/pengumpulan',
          icon: Truck,
          badge: null
        },
        {
          id: 'anomali',
          title: 'Deteksi Anomali',
          path: '/anomali',
          icon: ShieldAlert,
          badge: openAnomaliesCount > 0 ? `${openAnomaliesCount}` : null,
          badgeDanger: true
        }
      ]
    }
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Ringkasan';
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
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-sidebar-bg border-r border-sidebar-border z-50 flex flex-col justify-between transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div>
          <div className="h-16 px-5 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Sirkula Logo" className="w-8 h-8 rounded-xl" />
              <div>
                <h1 className="text-sm font-black tracking-tight text-foreground leading-none">
                  SIRKULA
                </h1>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mt-0.5">
                  Admin &amp; Material Hub
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-3 block mb-1.5">
                  {section.label}
                </span>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-xs'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              item.badgeDanger
                                ? 'bg-rose-500 text-white'
                                : 'bg-sidebar-accent text-sidebar-foreground'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-3 border-t border-sidebar-border bg-sidebar-bg">
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                SR
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-foreground truncate">Administrator</h4>
                <p className="text-[10px] font-mono text-muted-foreground truncate">admin@sirkula.id</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0"
              title="Keluar ke Login"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border text-foreground hover:bg-muted"
            >
              <Menu className="w-4 h-4" />
            </button>
            <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span>Sirkula Admin</span>
              <span>/</span>
              <span className="font-bold text-foreground">{getPageTitle()}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Operational Status */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistem Aktif</span>
            </div>

            {/* Quick Demo Actions */}
            <button
              onClick={simulateLiveTransaction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition"
              title="Simulasi setoran botol/kaleng baru ke salah satu RVM"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulasi Transaksi</span>
            </button>

            <button
              onClick={resetDemoData}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title="Reset data ke default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto bg-card border border-border shadow-xl rounded-2xl p-4 flex items-start gap-3 transition-all"
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-foreground leading-tight">{toast.title}</h5>
                <p className="text-[11px] text-muted-foreground mt-0.5">{toast.description}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
