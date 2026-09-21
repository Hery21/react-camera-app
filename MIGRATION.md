# Migrating the Game Boy camera into your Expo Router template

This bundle adds the camera feature as a **new tab/route** (`/camera`)
alongside your existing Home and Explore tabs, following your template's
exact conventions (kebab-case filenames, `@/` path alias, `StyleSheet.create`,
`SafeAreaView`, file-based routing under `src/app`).

## 1. Copy files in

Drop everything from this zip's `src/` into your project's `src/`,
merging folders (nothing here overwrites your existing Home/Explore/
themed-* files):

```
src/
  app/
    camera.tsx                          <- NEW route, becomes the /camera screen
  components/
    app-tabs.tsx                        <- REPLACES your existing one (adds Camera tab)
    app-tabs.web.tsx                    <- REPLACES your existing one (adds Camera tab)
    camera/                             <- NEW folder, the whole feature lives here
      viewfinder.tsx
      photo-preview.tsx
      qr-popup.tsx
      controls.tsx
      __tests__/
        viewfinder.test.tsx
        photo-preview.test.tsx
        qr-popup.test.tsx
        controls.test.tsx
  constants/
    game-boy-theme.ts                   <- NEW, feature-specific palette/font
    qr-messages.ts                      <- NEW, your QR id -> text lookup table
    __tests__/
      qr-messages.test.ts
  hooks/
    use-camera-permission.ts            <- NEW
    use-game-boy-metrics.ts             <- NEW
  utils/
    resolve-qr-message.ts               <- NEW
    __tests__/
      resolve-qr-message.test.ts
```

**Why `app-tabs.tsx`/`app-tabs.web.tsx` are full replacements, not
patches**: I have your exact current file contents, so these two files
are your originals with exactly one `<NativeTabs.Trigger>` /
`<TabTrigger>` block added for `camera` - nothing else changed. Diff
them against your originals if you want to confirm before overwriting.

**Why `game-boy-theme.ts` is separate from your `constants/theme.ts`**:
this feature's palette (saturated red plastic shell, pink/green buttons,
pixel font) is fixed and decorative - it has nothing to do with your
app's light/dark `ThemeColor` system that `ThemedText`/`ThemedView`
consume. Merging them would pollute a file every other screen depends
on. `camera.tsx` does still reuse `BottomTabInset`/`Spacing` from your
real `constants/theme.ts`, since those are layout tokens, not
color/theme ones.

## 2. Install packages

```bash
npx expo install expo-camera expo-linear-gradient expo-font
npx expo install @expo-google-fonts/press-start-2p

npm install --save-dev jest-expo @testing-library/react-native react-test-renderer
```

`expo install` (not `npm install`) pins versions compatible with your
installed Expo SDK - important for `expo-camera`/`expo-linear-gradient`.

Your template doesn't currently have a test runner configured at all
(no jest/vitest config was in the files you shared), so this also
introduces one for the first time.

## 3. `app.json` - camera permission + plugin

I don't have your actual `app.json` contents, so merge this into your
existing `"plugins"` array rather than replacing the file:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to scan QR codes and take photos."
        }
      ]
    ]
  }
}
```

## 4. `package.json` - test config

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

## 5. Tab icon asset (native only)

`app-tabs.tsx` references `require('@/assets/images/tabIcons/camera.png')`,
matching how `home.png`/`explore.png` are already loaded. I generated a
candidate icon in our conversation (a flat black silhouette on a
transparent background, matching your `renderingMode="template"` tinting
setup) - save it to:

```
assets/images/tabIcons/camera.png
```

I could not embed this PNG inside the zip itself (image generation and
file-bundling are separate tools in this environment), so it needs to
be added by hand. Swap it for your own icon anytime - just keep it a
flat silhouette with transparent background so `renderingMode="template"`
can tint it correctly.

The web tab bar (`app-tabs.web.tsx`) is text-only already (no icons), so
nothing extra is needed there.

## 6. Why two subsystems from the original web app don't exist here at all

- **QR scanning**: no custom canvas-polling + `jsQR` decode loop was
  ported, because `expo-camera`'s `<CameraView>` has QR detection built
  in natively (`barcodeScannerSettings` + `onBarcodeScanned` in
  `viewfinder.tsx`) - hardware-accelerated, no JS frame loop. Re-adding
  a JS decoder the platform already provides for free would violate
  YAGNI.
- **Canvas-based photo capture**: RN has no Canvas API at all, but none
  is needed - `expo-camera`'s `takePictureAsync()` already returns a
  file URI ready for `<Image>` (see `photo-preview.tsx`).

## 7. Known trade-offs

- **D-pad shape**: no `clip-path` in RN. `controls.tsx` builds the plus
  from two overlapping same-colored `<View>`s - a rounded-corner cross,
  not the original's exact polygon cut. `react-native-svg`'s `<Path>`
  can recover pixel parity later if you want it.
- **Shadows**: RN supports one shadow definition per `View` (no stacked
  `filter: drop-shadow()` chains), so the chunky multi-layer shadow look
  is softened to a single shadow.
- **The whole-pad "tilt" press effect** (`:has()` in the original CSS)
  is rebuilt with an `Animated.Value` driven by `onPressIn`/`onPressOut`
  in `controls.tsx` - same effect, state-driven instead of selector-driven.
- **Fonts**: loaded via `@expo-google-fonts/press-start-2p` +
  `useFonts()` in `camera.tsx` - there's a brief blank frame on cold
  start while the font loads (`if (!fontsLoaded) return <View .../>`).

## 8. Testing

All four camera components have `__tests__` using
`@testing-library/react-native` (accessibility role/label queries, no
CSS classes to assert on - different from DOM-based RTL queries). Once
`jest-expo` is configured (step 2/4), run:

```bash
npm test
```

`viewfinder.test.tsx` relies on `jest-expo`'s built-in mock for
`expo-camera`'s native module - no manual mocking needed.
