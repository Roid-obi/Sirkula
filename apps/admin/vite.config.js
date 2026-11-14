import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        mesin: resolve(__dirname, 'mesin.html'),
        transaksi: resolve(__dirname, 'transaksi.html'),
        analitik: resolve(__dirname, 'analitik.html'),
        reward: resolve(__dirname, 'reward.html'),
        pengumpulan: resolve(__dirname, 'pengumpulan.html'),
        anomali: resolve(__dirname, 'anomali.html'),
        peta: resolve(__dirname, 'peta.html')
      }
    }
  }
});
