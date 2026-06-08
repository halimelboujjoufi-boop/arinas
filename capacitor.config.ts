import type { CapacitorConfig } from "@capacitor/cli";

/**
 * ARINAS native Android shell.
 *
 * Strategy: hosted WebView. The app loads the live, server-rendered site
 * (https://arinas.ma) so middleware (locale routing), API routes, Supabase
 * server reads, and admin protection all keep working — none of which a
 * Capacitor static export could support. `webDir` is only a local fallback
 * shown while the site loads or if the network is unavailable.
 */
const config: CapacitorConfig = {
  appId: "ma.arinas.app",
  appName: "ARINAS",
  webDir: "android-www",
  backgroundColor: "#0A0A0A",
  server: {
    url: "https://arinas.ma",
    androidScheme: "https",
    cleartext: false,
    // Keep navigation inside trusted hosts; everything else opens in the
    // system browser (handled in MainActivity / App plugin).
    allowNavigation: ["arinas.ma", "*.arinas.ma", "*.supabase.co"],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#0A0A0A",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1600,
      launchAutoHide: true,
      backgroundColor: "#0A0A0A",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0A0A0A",
    },
  },
};

export default config;
