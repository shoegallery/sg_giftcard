import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../core/theme";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function Header(props) {
  return <Text style={styles.header} {...props} />;
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    top: hp("1%"),
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
