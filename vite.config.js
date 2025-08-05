import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: 'info', // 'error' | 'warn' | 'info' | 'silent'
  server: {
    // 클라이언트 오류도 터미널에 표시
    hmr: {
      overlay: true
    }
  },
  // 빌드 시 더 자세한 정보 표시
  build: {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500
  }
});
