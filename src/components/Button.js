import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[styles.button, mode === "outlined" && {}, style]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: wp("80%"),
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
