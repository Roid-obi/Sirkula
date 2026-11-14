import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, MapPin, QrCode, Gift, User } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const isScanActive =
    location.pathname.startsWith('/app/scan') ||
    location.pathname.startsWith('/app/setor') ||
    location.pathname.startsWith('/app/session');

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-zinc-950 flex justify-center">
      {/* Mobile App Container Shell */}
      <div className="w-full max-w-md min-h-screen bg-background text-foreground flex flex-col relative shadow-xl pb-20">
        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Solid Native Mobile Tab Bar (NO Glassmorphism) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border flex items-center justify-between h-16 px-3 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          {/* Tab 1: Beranda */}
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `flex-1 h-full flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`
            }
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight leading-none">Beranda</span>
          </NavLink>

          {/* Tab 2: Lokasi RVM */}
          <NavLink
            to="/app/lokasi"
            className={({ isActive }) =>
              `flex-1 h-full flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`
            }
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight leading-none">Lokasi</span>
          </NavLink>

          {/* Tab 3: Center Elevated SETOR / SCAN Action Button */}
          <div className="flex-1 h-full flex flex-col items-center justify-center relative">
            <NavLink
              to="/app/scan"
              className="relative -top-5 flex flex-col items-center group focus:outline-none"
              title="Pindai QR Mesin RVM"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-95 ring-4 ring-card ${
                  isScanActive
                    ? 'bg-emerald-600 text-white shadow-emerald-700/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/30'
                }`}
              >
                <QrCode className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-extrabold tracking-wider mt-1 uppercase leading-none ${
                  isScanActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                SETOR
              </span>
            </NavLink>
          </div>

          {/* Tab 4: Reward */}
          <NavLink
            to="/app/reward"
            className={({ isActive }) =>
              `flex-1 h-full flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`
            }
          >
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight leading-none">Reward</span>
          </NavLink>

          {/* Tab 5: Profil */}
          <NavLink
            to="/app/profil"
            className={({ isActive }) =>
              `flex-1 h-full flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`
            }
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight leading-none">Akun</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
