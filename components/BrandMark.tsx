import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size * 0.22 }]}> 
      <Image
        source={require("../assets/brand/curious-book-mark-transparent-v4.png")}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: "hidden", alignItems: "center", justifyContent: "center" },
});
