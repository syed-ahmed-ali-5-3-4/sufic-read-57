import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eb9e8c8eb3af4894a27116c781fe729f',
  appName: 'sufic-read-57',
  webDir: 'dist',
  server: {
    url: "https://eb9e8c8e-b3af-4894-a271-16c781fe729f.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a202c",
      showSpinner: false
    }
  }
};

export default config;