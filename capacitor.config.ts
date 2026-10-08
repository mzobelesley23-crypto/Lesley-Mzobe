import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jozicart.app',
  appName: 'JoziCart',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
