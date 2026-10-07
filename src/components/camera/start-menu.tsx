import { useMemo } from "react";
import { ImageBackground, type ImageSourcePropType, View } from "react-native";
import PixelText from "./pixel-text";
import { createStartMenuStyles } from "./styles/start-menu.styles";

const SCREEN_BACKGROUND =
  require("../../../assets/images/background.jpg") as ImageSourcePropType;

export interface StartMenuOption {
  value: string;
  label: string;
}

export interface StartMenuProps {
  options: readonly StartMenuOption[];
  selectedIndex: number;
  unit: number;
}

export default function StartMenu({
  options,
  selectedIndex,
  unit,
}: StartMenuProps) {
  const styles = useMemo(() => createStartMenuStyles(unit), [unit]);

  return (
    <ImageBackground
      source={SCREEN_BACKGROUND}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.greenOverlay} />

      <View style={styles.container}>
        <PixelText style={styles.title}>
          WHAT WOULD{"\n"}YOU LIKE TO DO?
        </PixelText>

        <View style={styles.optionList}>
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            return (
              <View key={option.value} style={styles.optionRow}>
                <PixelText
                  style={[styles.cursor, !isSelected && styles.cursorHidden]}
                >
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAACXBIWXMAAC4jAAAuIwF4pT92AAABHVBMVEVHcExNGCRgKDZYHStqLDprKTlhJTZjJjdSFydhJDVQGCdyFCijLiSTKC6FMTduLjvNDTCKEyrTCC+yCyyAJTi7Oi3aBi7GDTFyKjnbQirsJym8EDCfFzOKMjZpLDf1SCbtRiiPNDXSPyySLjPkM0/4TSz9Zkb8v7LOJirdHTuMHzeBLzeWYzyEITf4WjyIJy39tKLqZ3WlJTn7qpnpS1roLD73o5qMUU6KREjrPUSvOjHhVT38clXTj4zwOSineTv8iG//bU7sYEpqLTxUGCdvFSiDMTdUGirJq1+yLibpzl3tyTHVkQ5PFyaAQy1xMiZxNTpRFyZmKzpyFClWGilpLTxgIS1/KCxeGiZSFydRGCZaGSdYHCtaHixTHCj+72HoAAAAX3RSTlMAAQwGSaFzfolYuP/////q/////v/////////////8////////////////////////////////////////////////nKfl49r//////6H///zgtrrNxf+1/1tm8U44E4vCnP4AAAFGSURBVHjatZHFdsJgEIVDShICpECIK17cre6GWwPR93+M/gnWU1Zd9FvdmW8x58yFDjg4juu6A51iR2YzzbR/bX0+HzAfw5Fpe/mAHwEslPJ9WVkgyHhsbdew30KKRa6U5CqEzFX6vVptbVmOKyKKxBSIqxQlCnxJbHSr2fDGtGAIfeNlqdN9ogmWEVQ+3Wy3cuGQ+IpB2HkiKWUuHmmKZNoPWRlkYMhQYGsKt1XXNOp7E90bluP/ZtRUfmcub1TP5OPuHXxNJ4S9yW2NQMaXOviXSQssxdO1KNNoJdJSpp4T4t7/bFOTmOidmqLYzrUskoVq9nPjGccwlrEYESa4YjOtxUAk1oaxawMPBoPvShkw0eYg68cSzs58WG8wHA5G04A7QD/BZv3JZDrdBE4rRdGINsdQGzoF/tJW4PD/m+fVC3wcvwG48z70iMQlNQAAAABJRU5ErkJggg=="
                    alt=""
                    style={styles.pointer}
                  />
                </PixelText>
                <PixelText
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </PixelText>
              </View>
            );
          })}
        </View>

        <PixelText style={styles.hint}>▲▼ Choose Ⓨ Open</PixelText>
      </View>
    </ImageBackground>
  );
}
