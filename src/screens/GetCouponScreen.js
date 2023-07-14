import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  UIManager,
} from "react-native";

import { Text } from "native-base";
import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const GetCouponScreen = ({ navigation }) => {
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          style={{ backgroundColor: "white" }}
          goBack={navigation.goBack}
        />
      ),
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>GetCouponScreen</Text>
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

export default GetCouponScreen;
