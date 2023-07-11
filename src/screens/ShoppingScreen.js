import React, { useRef, useState,useContext } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NumberFormat from "react-number-format";

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
    <Pressable maxW="96">
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Box
            justifyContent={"center"}
            alignItems={"center"}
            alignSelf="center"
            maxWidth={"95%"}
            width={"95%"}
            bg={
              isPressed
                ? "coolGray.200"
                : isHovered
                ? "coolGray.200"
                : "coolGray.100"
            }
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
            p="4"
            rounded="8"
            shadow={2}
            borderWidth="0"
            borderColor="coolGray.300"
          >
            <HStack>
              <Box width={"50%"}>
                <HStack space={3} alignSelf={"flex-start"}>
                  <Box alignSelf="center">
                    <MaterialCommunityIcons
                      name="arrow-right-box"
                      size={32}
                      color="red"
                    />
                  </Box>
                  <Text
                    color="coolGray.800"
                    fontWeight="medium"
                    fontSize="md"
                    alignSelf={"center"}
                  >
                    Зарцуулах
                  </Text>
                </HStack>
              </Box>
              <Box width={"42%"} justifyContent="center">
                
              </Box>
              <Box width={"8%"} justifyContent="center">
                <AntDesign name="right" size={28} color="#616161" />
              </Box>
            </HStack>
          </Box>
        );
      }}
    </Pressable>
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
