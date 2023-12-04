import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.IntrusionDetection.AMDB',
  appName: 'IntrusionDetection',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    LocalNotifications: {
      "iconColor": "#488AFF",
    }
  }
};

export default config;
