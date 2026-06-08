"use client";

import { useEffect } from "react";

/**
 * Bridges the web app to the native Capacitor shell. All logic is gated on
 * Capacitor.isNativePlatform(), so it is a complete no-op in a normal browser
 * (and on the Vercel web deploy). Handles: splash hide, status bar style,
 * push-notification permission + token registration, and deep links.
 */
export default function NativeBridge() {
  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      let Capacitor: typeof import("@capacitor/core").Capacitor;
      try {
        ({ Capacitor } = await import("@capacitor/core"));
      } catch {
        return;
      }
      if (!Capacitor.isNativePlatform()) return;

      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Dark });
      } catch {}

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch {}

      // Deep links — keep arinas.ma URLs inside the WebView.
      let urlSub: { remove: () => void } | null = null;
      try {
        const { App } = await import("@capacitor/app");
        urlSub = await App.addListener("appUrlOpen", ({ url }) => {
          try {
            const u = new URL(url);
            if (u.host.endsWith("arinas.ma")) {
              window.location.href = u.pathname + u.search + u.hash;
            }
          } catch {}
        });
      } catch {}

      // Push notifications.
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive === "granted") {
          await PushNotifications.register();
        }
        await PushNotifications.addListener("registration", (token) => {
          fetch("/api/push/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.value, platform: "android" }),
          }).catch(() => {});
        });
        await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
          const link = action.notification?.data?.link;
          if (typeof link === "string") window.location.href = link;
        });
      } catch {}

      cleanup = () => {
        urlSub?.remove();
      };
    })();

    return () => cleanup();
  }, []);

  return null;
}
