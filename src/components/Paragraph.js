import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

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
