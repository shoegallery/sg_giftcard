import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  Box,
  useDisclose,
  IconButton,
  Stagger,
  HStack,
  Icon,
  Center,
  NativeBaseProvider,
  Text,
  View,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function BackButton({ goBack }) {
  return (
    <View
      style={{
        position: "relative",
        paddingTop: hp("1%"),
        alignSelf: "flex-start",
      }}
    >
      <IconButton
        mb="4"
        variant="solid"
        bg="white"
        colorScheme="red"
        borderRadius="full"
        icon={
          <Icon
            as={Ionicons}
            _dark={{
              color: "white",
            }}
            size={wp("10%")}
            name="arrow-back"
            color="black"
            onPress={goBack}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: wp("6%") + getStatusBarHeight(),
    left: wp("8%"),
  },
  image: {
    backgroundColor: "red",
    width: hp("8%"),
    height: hp("8%"),
  },
});
