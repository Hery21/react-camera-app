# MVP Manual Acceptance Matrix

Run this against the development server and again on the deployed HTTPS site when appropriate. Do not mark a device/browser case complete unless it was physically verified.

## Core visitor loop

- Welcome -> scanner opens and camera auto-starts.
- EN / ID / ZH can be changed without resetting the active screen.
- Known PSBIKT QR -> camera stops -> Scan Result.
- Scan Result -> View Details -> Exhibit article.
- Scan Result -> Scan Again -> fresh scanner with auto-start.
- Exhibit -> Scan Next Exhibit -> fresh scanner with auto-start.
- Scanner Back -> camera releases.

## QR recovery

- Unsupported QR remains recoverable and camera continues scanning.
- Unknown but valid-format PSBIKT code remains recoverable.
- Lowercase PSBIKT prefix resolves to the canonical uppercase exhibit ID.

## Camera recovery

- Permission allowed.
- Permission denied.
- Try Again.
- Stop Camera, then manual Start Camera.
- Camera indicator turns off after Back and after accepted scan.

## Content

- PSBIKT-001 through PSBIKT-008 resolve to distinct exhibits.
- EN, ID, and ZH show translated title, summary, and story.
- PSBIKT-006 shows the Catur Cina cover image.
- Missing cover images on other exhibits do not create broken-image UI.
- Optional Symbolism and Gallery sections appear only when data exists.

## Responsive/accessibility

- Check 320x568, 360x640, 390x844, and 430x932 portrait layouts.
- Check phone landscape.
- Check visible focus using keyboard where applicable.
- Check 200% browser zoom on result/article pages.
- Welcome remains owned by the user’s manual visual tuning and must not be overwritten by automated phases.

## Target browsers

- iOS Safari.
- Android Chrome.

Android Chrome remains a release acceptance item until physically verified.
