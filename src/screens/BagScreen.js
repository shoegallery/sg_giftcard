import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,

  Dimensions,
  TouchableOpacity,
  Platform,
  UIManager,
} from "react-native";
import {
    MaterialIcons,
    Feather,
    Entypo,
    AntDesign,
    FontAwesome5,
    MaterialCommunityIcons,
    FontAwesome,
    Octicons,
  } from "@expo/vector-icons";
import {
    Box,
    FlatList,
    Heading,
    Avatar,
    HStack,
    VStack,
    Text,
    Spacer,
    Center,
    NativeBaseProvider,
    Icon,
  } from "native-base";
import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const BagScreen = ({ navigation }) => {
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
      <Text>BagScreen</Text>
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

export default BagScreen;
