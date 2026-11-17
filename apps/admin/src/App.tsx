import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MachinesPage } from './pages/MachinesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { RewardsPage } from './pages/RewardsPage';
import { CollectionPage } from './pages/CollectionPage';
import { AnomaliesPage } from './pages/AnomaliesPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main Admin Application Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mesin" element={<MachinesPage />} />
          <Route path="/peta" element={<Navigate to="/mesin?view=map" replace />} />
          <Route path="/transaksi" element={<TransactionsPage />} />
          <Route path="/analitik" element={<AnalyticsPage />} />
          <Route path="/reward" element={<RewardsPage />} />
          <Route path="/pengumpulan" element={<CollectionPage />} />
          <Route path="/anomali" element={<AnomaliesPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
