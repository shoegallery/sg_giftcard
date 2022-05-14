import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../core/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function TextInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp("10%"),
    width: wp("80%"),
    marginVertical: hp("1%"),
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontWeight: "200",
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: hp("1%"),
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: hp("0%"),
    marginBottom: hp("1%"),
  },
});
