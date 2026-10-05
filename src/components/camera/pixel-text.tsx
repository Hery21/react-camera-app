import { Text, type TextProps } from 'react-native';

/**
 * Every <Text> in RN defaults `allowFontScaling` to `true` - meaning the
 * device's OS-level accessibility font-size/zoom setting silently
 * multiplies our `fontSize` on top of whatever value we calculated from
 * `unit`. That's the actual cause of "word spacing/content still
 * affected by zoom": shapes (D-pad, buttons, bezel) were never subject
 * to this at all, only text - our `letterSpacing` values are fixed dp
 * numbers that DON'T get OS-rescaled the same way `fontSize` does, so
 * when the OS changes its font scale, the ratio between glyph size and
 * our letter-spacing drifts, which reads as spacing "changing with
 * zoom".
 *
 * This console is a fixed pixel-font skin, not reflowable prose - it
 * should look identical regardless of the viewer's OS text-size
 * setting, the same way a real Game Boy's screen font never responds to
 * a phone's accessibility settings. `PixelText` is a drop-in <Text>
 * replacement that opts out of OS font scaling by default, so only our
 * own `unit` math ever controls size - nothing else. Every text element
 * inside the camera feature should use this instead of the raw RN
 * `<Text>`.
 */
export default function PixelText({ allowFontScaling = false, ...props }: TextProps) {
  return <Text allowFontScaling={allowFontScaling} {...props} />;
}
