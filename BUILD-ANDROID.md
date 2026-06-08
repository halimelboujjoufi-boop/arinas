# ARINAS — Android App (Capacitor)

The native Android app is a **Capacitor hosted-WebView shell** around the live
site `https://arinas.ma`. The website stays server-rendered (i18n middleware,
API routes, Supabase, admin security all keep working); the native layer adds
splash, icon, push notifications, deep links and Play Store packaging.

> Why not a static export? ARINAS uses Next.js middleware + API routes +
> dynamic server rendering, none of which a Capacitor static export supports.
> The hosted-WebView approach is the correct way to wrap this app.

---

## 0. Prerequisites (your machine)

- **Android Studio** (latest) with Android SDK + Platform Tools
- **JDK 17**
- The repo cloned, then: `npm install`

The project (`android/`) is already generated and committed.

---

## 1. Open & run (debug)

```bash
npm run cap:sync        # copy web config + plugins into android/
npm run android:open    # opens Android Studio
```
In Android Studio: pick a device/emulator → Run ▶. The app loads `arinas.ma`.

Or from CLI: `cd android && ./gradlew installDebug`

---

## 2. App icon & splash screen (branding)

A dark on-brand splash is already set. To generate a full branded icon + splash:

1. Put source images in `assets/` at the repo root:
   - `assets/icon-only.png` (1024×1024, logo on transparent/solid)
   - `assets/icon-foreground.png` (1024×1024, adaptive foreground)
   - `assets/icon-background.png` (1024×1024, e.g. solid `#0A0A0A`)
   - `assets/splash.png` (2732×2732) and `assets/splash-dark.png`
2. Generate:
   ```bash
   npm i -D @capacitor/assets
   npm run android:assets
   npm run cap:sync
   ```
This writes all mipmap/adaptive icons + splash densities.

---

## 3. Push notifications (Firebase Cloud Messaging)

1. Create a Firebase project → add an Android app with package **`ma.arinas.app`**.
2. Download **`google-services.json`** → place at `android/app/google-services.json`
   (gitignored). The Gradle config auto-detects it.
3. Rebuild. On first launch the app requests notification permission and posts
   its FCM token to `POST /api/push/register` (stored in the `push_tokens`
   Supabase table — see `supabase/schema.sql`).
4. Send notifications from your backend / Firebase console to those tokens.
   Include a `data.link` (e.g. `https://arinas.ma/shop`) to deep-link on tap.

The plugin, manifest permission (`POST_NOTIFICATIONS`) and web bridge
(`src/components/NativeBridge.tsx`) are already wired.

---

## 4. Deep links (Android App Links)

`AndroidManifest.xml` already has a verified intent filter for
`https://arinas.ma` and `https://www.arinas.ma`.

To make links open the app automatically (not the browser):
1. After creating your release keystore (step 5), get its SHA256:
   ```bash
   keytool -list -v -keystore arinas-release.jks -alias arinas
   ```
2. Put that fingerprint (and the **Play App Signing** SHA256 from the Play
   Console once uploaded) into `public/.well-known/assetlinks.json`, replacing
   the placeholders. Deploy the web app so it serves
   `https://arinas.ma/.well-known/assetlinks.json`.

---

## 5. Release keystore (one time)

```bash
keytool -genkey -v -keystore arinas-release.jks -keyalg RSA -keysize 2048 \
        -validity 10000 -alias arinas
```
Keep this file **safe and backed up** — losing it means you can never update the
app on Play. Then create `keystore.properties` (gitignored) from the example:

```properties
storeFile=../arinas-release.jks
storePassword=********
keyAlias=arinas
keyPassword=********
```

---

## 6. Build signed APK / AAB

```bash
npm run cap:sync
npm run android:aab     # -> android/app/build/outputs/bundle/release/app-release.aab  (Play Store)
npm run android:apk     # -> android/app/build/outputs/apk/release/app-release.apk      (sideload/testing)
```
(or `./gradlew bundleRelease` / `assembleRelease` from `android/`)

Bump `versionCode` (integer, +1 each upload) and `versionName` in
`android/app/build.gradle` before each release.

---

## 7. Google Play submission checklist

- [ ] Play Console → Create app → upload **app-release.aab**
- [ ] Enable **Play App Signing** (recommended) → copy its SHA256 into
      `assetlinks.json` and redeploy the web app
- [ ] Store listing: title, short/full description (provide AR/FR/EN),
      screenshots (phone + tablet), feature graphic (1024×500), app icon (512×512)
- [ ] Privacy Policy URL (required) — host at `https://arinas.ma/privacy`
- [ ] Data safety form, content rating questionnaire, target audience
- [ ] Set category = Shopping
- [ ] Release to **Internal testing** first → then Production

---

## Admin security in the app

The admin area is protected **server-side** (Supabase session + the
`(dashboard)` route guard). Because the app loads the real site, the exact same
protection applies inside the WebView — no admin code or secret ships in the
APK. `/admin` is also `noindex` and `no-store`.
