/**
 * The app's displayed text identity - shown on the title/welcome screen
 * (WelcomeScreen). This is the single place to edit the wordmark/tagline
 * text if you rename the app later.
 *
 * Deliberately separate from the `logo-slot` placeholder rendered below
 * the camera screen in camera.tsx: that slot is for a graphical image
 * logo (swap the placeholder <View> for an <Image>), while this is the
 * pixel-font TEXT wordmark used specifically on the title screen - two
 * different kinds of branding, two different places to edit them.
 */
export const APP_NAME = 'RELIC CAM';
export const APP_TAGLINE = 'STEP INTO HISTORY';
