import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function Paragraph(props) {
  return <Text style={styles.text} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 10,
  },
});
