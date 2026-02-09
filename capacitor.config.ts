import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familystars.app',
  appName: 'Семейные Звёздочки',
  webDir: 'public',
  server: {
    // В разработке: пока запущен next dev, укажите ваш URL (например с телефона в той же сети)
    url: process.env.CAPACITOR_SERVER_URL || 'http://localhost:3000',
    cleartext: true,
  },
  plugins: {
    AdMob: {
      requestTrackingAuthorization: false,
      testing: process.env.NODE_ENV === 'development',
      // Рекламные блоки создаются в коде с tagForChildDirectedTreatment: true
    },
  },
};

export default config;
