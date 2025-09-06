import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.99bb1b68e01046c1a305d00b6a807f1e',
  appName: 'sufic-read-93',
  webDir: 'dist',
  server: {
    url: "https://99bb1b68-e010-46c1-a305-d00b6a807f1e.lovableproject.com?forceHideBadge=true",
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