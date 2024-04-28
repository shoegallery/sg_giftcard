import React, { useRef, useState, useContext } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NumberFormat from "react-number-format";
import { WebView } from "react-native-webview";
import { StateContext, StateContextHistory } from "../Context/StateContext";

import {
  Pressable,
  Text,
  Box,
  HStack,
  Spacer,
  Flex,
  Badge,
  Center,
  NativeBaseProvider,
} from "native-base";
const { width, height } = Dimensions.get("window");

const ShoppingScreen = () => {
  const [userData, setUserData] = useContext(StateContext);
  return (
    <View>
      <StatusBar barStyle="light-content" backgroundColor={"#6c2699"} />
      <Box height={"100%"}>
        <WebView
          source={{
            style: { justifyContent: "flex-start" },
            uri: "https://shoppy.mn/",
          }}
        />
      </Box>
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

export default ShoppingScreen;
