import React from "react";
import { Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
export default function Logo() {
  return <Image source={require("../assets/logo.png")} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    position: "relative",
    width: wp("40%"),
    height: wp("40%"),
  },
});
