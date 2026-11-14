import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { SetorPage } from './pages/SetorPage';
import { ScanPage } from './pages/ScanPage';
import { SessionPage } from './pages/SessionPage';
import { TransactionDetailPage } from './pages/TransactionDetailPage';
import { LocationPage } from './pages/LocationPage';
import { RewardPage } from './pages/RewardPage';
import { RewardHistoryPage } from './pages/RewardHistoryPage';
import { HistoryPage } from './pages/HistoryPage';
import { ImpactPage } from './pages/ImpactPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpPage } from './pages/HelpPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Scan page has full-screen camera viewfinder outside bottom bar */}
        <Route path="/app/scan" element={<ScanPage />} />

        {/* Main User App Shell */}
        <Route element={<AppLayout />}>
          <Route path="/app" element={<HomePage />} />
          <Route path="/app/setor" element={<SetorPage />} />
          <Route path="/app/session/:id" element={<SessionPage />} />
          <Route path="/app/transaction/:id" element={<TransactionDetailPage />} />
          <Route path="/app/lokasi" element={<LocationPage />} />
          <Route path="/app/reward" element={<RewardPage />} />
          <Route path="/app/reward/history" element={<RewardHistoryPage />} />
          <Route path="/app/riwayat" element={<HistoryPage />} />
          <Route path="/app/impact" element={<ImpactPage />} />
          <Route path="/app/profil" element={<ProfilePage />} />
          <Route path="/app/bantuan" element={<HelpPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
