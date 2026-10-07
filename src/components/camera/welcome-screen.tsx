import { APP_NAME, APP_TAGLINE } from "@/constants/branding";
import { useBlink } from "@/hooks/use-blink";
import { useMemo } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  type ImageSourcePropType,
  View,
} from "react-native";
import PixelText from "./pixel-text";
import { createWelcomeScreenStyles } from "./styles/welcome-screen.styles";

const IKTLogo =
  require("../../../assets/images/IKT-icon.gif") as ImageSourcePropType;
const SCREEN_BACKGROUND =
  require("../../../assets/images/background.jpg") as ImageSourcePropType;

export interface WelcomeScreenProps {
  appName?: string;
  tagline?: string;
  unit: number;
}

export default function WelcomeScreen({
  appName = APP_NAME,
  tagline = APP_TAGLINE,
  unit,
}: WelcomeScreenProps) {
  const styles = useMemo(() => createWelcomeScreenStyles(unit), [unit]);
  const blink = useBlink();

  return (
    <ImageBackground
      source={SCREEN_BACKGROUND}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.greenOverlay} />

      <View style={styles.container}>
        {/* <View style={styles.badge}>
          <PixelText style={styles.badgeGlyph}>★</PixelText>
        </View> */}
        <Image
          source={IKTLogo}
          style={{ width: unit * 16, height: unit * 16, resizeMode: "contain" }}
        />

        <PixelText style={styles.appName}>{appName}</PixelText>
        <PixelText style={styles.tagline}>{tagline}</PixelText>

        <Animated.Text
          allowFontScaling={false}
          style={[styles.prompt, { opacity: blink }]}
        >
          PRESS START
        </Animated.Text>
      </View>
    </ImageBackground>
  );
}
