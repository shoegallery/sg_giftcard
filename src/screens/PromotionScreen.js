import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PromotionScreen = () => {
  return (
    <View style={styles.container}>
      <Text>PromotionScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    minHeight: height * 0.7,
    width,
    backgroundColor: "blue",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default PromotionScreen;
