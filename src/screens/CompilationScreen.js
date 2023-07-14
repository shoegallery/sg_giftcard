import React, {  useEffect } from "react";
import {

  View,
  StyleSheet,

  Dimensions,

  Platform,
  UIManager,
} from "react-native";

import {
 
  Text,
  
} from "native-base";

const { width, height } = Dimensions.get("window");

const CompilationScreen = ({ navigation }) => {
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>CompilationScreen</Text>
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

export default CompilationScreen;
