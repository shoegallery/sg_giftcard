import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Platform,
  UIManager,
  TouchableHighlight,
  BackHandler,
  StatusBar,
  Linking,
  Share,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import TypeWriterEffect from "react-native-typewriter-effect";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";

import {
  Text,
  Box,
  Center,
  Icon,
  HStack,
  VStack,
  Select,
  useToast,
  CheckIcon,
  Slider,
  Pressable,
  Container,
  Heading,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import appJson from "../../app.json";
const Tab = createBottomTabNavigator();
export default function ProfileScreen({ navigation }) {
  const handlePressCloseApp = () => {
    BackHandler.remove(); // Close the app (for Android)
  };
  const onShare = async () => {
    try {
      let messageOs;
      if (Platform.OS === "android") {
        messageOs =
          "https://play.google.com/store/apps/details?id=com.shoegallery.sg_wallet_app";
      } else if (Platform.OS === "ios") {
        messageOs =
          "https://apps.apple.com/us/app/shoegallery-wallet/id1631641856";
      }
      const result = await Share.share({ message: messageOs });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const [isopen, Setisopen] = useState();
  useEffect(() => {
    Setisopen(false);
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Center backgroundColor={"#ffffff"}>
        <Container width={"95%"}>
          <Heading pt={3}>
            <Text>Store Plus 🚀</Text>
            <Text color="#6172F3"> Хязгааргүй</Text>
          </Heading>
        </Container>
      </Center>
      <ScrollView>
        <Box
          height={"100%"}
          width={"100%"}
          alignItems={"center"}
          justifyItems={"center"}
          backgroundColor={"#ffffff"}
        >
          <Box width={"100%"} paddingTop={"3"}>
            {/* + */}
            <HStack
              paddingTop={"1"}
              alignContent={"center"}
              justifyContent={"center"}
              width={"100%"}
            >
              <Pressable paddingLeft={3} width={"1/3"}>
                <Image
                  style={{
                    height: 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                  source={require("../assets/gif/huree.jpg")}
                />
              </Pressable>

              <Pressable
                alignItems={"center"}
                paddingLeft={2}
                paddingRight={3}
                width={"2/3"}
              >
                <Text fontSize={"md"} fontWeight="medium">
                  <TypeWriterEffect content="Шилдэг дипломд нэр дэвшигч CS тэнхэмийн төгсөгч Aриунсүх овогтой Тамирын дипломын ажил" />
                </Text>
              </Pressable>
            </HStack>

            <Pressable onPress={() => {}} paddingTop={6} alignItems={"center"}>
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignSelf="center"
                    width={"85%"}
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
                      <Box width={"94%"}>
                        <HStack space={2} alignSelf={"flex-start"}>
                          <Box alignSelf="center">
                            <MaterialCommunityIcons
                              name="chat"
                              size={32}
                              color="#6172F3"
                            />
                          </Box>
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            alignSelf={"center"}
                            fontSize="md"
                          >
                            StorePlus чат апп
                          </Text>
                        </HStack>
                      </Box>
                      <Box width={"6%"} justifyContent="center">
                        <AntDesign name="right" size={20} color="#616161" />
                      </Box>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
            <Pressable onPress={() => {}} paddingTop={3} alignItems={"center"}>
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignSelf="center"
                    width={"85%"}
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
                      <Box width={"94%"}>
                        <HStack space={2} alignSelf={"flex-start"}>
                          <Box alignSelf="center">
                            <MaterialCommunityIcons
                              name="help-circle-outline"
                              size={32}
                              color="green"
                            />
                          </Box>
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            alignSelf={"center"}
                            fontSize="md"
                          >
                            Тусламж зөвлөгөө
                          </Text>
                        </HStack>
                      </Box>
                      <Box width={"6%"} justifyContent="center">
                        <AntDesign name="right" size={20} color="#616161" />
                      </Box>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
            <Pressable
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(`tel:${86218721}`);
                } else {
                  Linking.openURL(`telprompt:${86218721}`);
                }
              }}
              paddingTop={3}
              alignItems={"center"}
            >
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignSelf="center"
                    width={"85%"}
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
                      <Box width={"94%"}>
                        <HStack space={2} alignSelf={"flex-start"}>
                          <Box alignSelf="center">
                            <MaterialCommunityIcons
                              name="phone"
                              size={32}
                              color="green"
                            />
                          </Box>
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            alignSelf={"center"}
                            fontSize="md"
                          >
                            Холбоо барих
                          </Text>
                        </HStack>
                      </Box>
                      <Box width={"6%"} justifyContent="center">
                        <AntDesign name="right" size={20} color="#616161" />
                      </Box>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
            <Pressable
              onPress={() => {
                onShare();
              }}
              paddingTop={3}
              alignItems={"center"}
            >
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignSelf="center"
                    width={"85%"}
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
                      <Box width={"94%"}>
                        <HStack space={2} alignSelf={"flex-start"}>
                          <Box alignSelf="center">
                            <Entypo
                              name="slideshare"
                              size={32}
                              color="#673ab7"
                            />
                          </Box>
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            alignSelf={"center"}
                            fontSize="md"
                          >
                            Найздаа хуваалцах
                          </Text>
                        </HStack>
                      </Box>
                      <Box width={"6%"} justifyContent="center">
                        <AntDesign name="right" size={20} color="#616161" />
                      </Box>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
            <Pressable
              onPress={async () => {
                AsyncStorage.getItem("user_uuid")
                  .then(async (result) => {
                    await AsyncStorage.setItem("user_uuid", "");
                  })
                  .catch((err) => {
                    console.log("user_phone baihgui");
                  });

                await AsyncStorage.getItem("user_phone")
                  .then(async (result) => {
                    console.log(result);
                    await AsyncStorage.setItem("user_phone", "");
                    await navigation.reset({
                      index: 0,
                      routes: [{ name: "LoginScreen" }],
                    });
                  })
                  .catch((err) => {
                    console.log("user_phone baihgui");
                  });
              }}
              paddingTop={3}
              alignItems={"center"}
            >
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignSelf="center"
                    width={"85%"}
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
                      <Box width={"94%"}>
                        <HStack space={2} alignSelf={"flex-start"}>
                          <Box alignSelf="center">
                            <Feather name="log-out" size={32} color="#ef5350" />
                          </Box>
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            alignSelf={"center"}
                            fontSize="md"
                          >
                            Гарах
                          </Text>
                        </HStack>
                      </Box>
                      <Box width={"6%"} justifyContent="center">
                        <AntDesign name="right" size={20} color="#616161" />
                      </Box>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
          </Box>
          <Box height={"20%"} pt={3} justifyContent={"flex-end"}>
            <Box justifyContent={"flex-end"} backgroundColor={"#ffffff"}>
              <View>
                <Text textAlign={"center"} color="#192d3b">
                  Point Plus LLC © {new Date().getFullYear()}
                </Text>
              </View>
              <Text
                textAlign={"center"}
                color="#192d3b"
                paddingBottom={10}
                fontSize="xs"
              >
                Аппликейшны хувилбар {appJson.expo.version}
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
