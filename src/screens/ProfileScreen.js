
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

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";

import {

  Text,

  Box,

  Center,

  Icon,
  HStack,
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* <Box height={"100%"} width={"100%"} backgroundColor={"#ececec"}>
        <Box height={"100%"} width={"100%"} paddingRight={-100}>
          <Select
            position={"absolute"}
            isOpen={isopen}
            color="#ececec"
            backgroundColor="amber.800"
            onPointerDownCapture
            borderWidth={0}

          >
            <Select.Item label="Гранд плаза | Shoe Gallery" value="10000001" />
            <Select.Item label="УБИД | BASCONI" value="10000002" />
            <Select.Item label="УБИД | Sasha Fabiani" value="10000003" />
            <Select.Item label="УБИД | Bugatti" value="10000004" />
            <Select.Item label="Максмоол | BASCONI" value="10000005" />
            <Select.Item label="Максмоол | Sasha Fabiani" value="10000006" />
            <Select.Item label="Максмоол | Shoe Gallery" value="10000007" />
            <Select.Item label="Хүннү-Моол | Shoe Gallery" value="10000008" />
            <Select.Item
              label="Имарт Хан-уул | Shoe Gallery"
              value="10000009"
            />
          </Select>
        </Box>
      </Box> */}
      <Box height={"full"} backgroundColor={"#ececec"}>
        <Box height={"80%"} width={"100%"} paddingTop={"6"}>
          <Center>
            <TouchableHighlight
              underlayColor="#89c4f4"
              onPress={() => {

              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                borderRadius={"0"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box>
                    <Box
                      backgroundColor={"#acd6f7"}
                      width={12}
                      borderRadius={"sm"}
                      height={12}
                      alignItems="center"
                      justifyContent={"center"}
                    >
                      <Icon
                        as={MaterialCommunityIcons}
                        width={"xl"}
                        size="lg"
                        name="license"
                        color="#374e62"
                      />
                    </Box>
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Хэрэглэгчийн мэдээлэл
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>

          <Center paddingTop={"6"}>
            <TouchableHighlight
              underlayColor="#b2dfdb"
              onPress={() => {

              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#b2dfdb"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Icon as={Octicons} size="lg" name="star" color="#004d40" />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Брэндийн танилцуулга
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"2"}>
            <TouchableHighlight
              underlayColor="#b2dfdb"
              onPress={() => {
                navigation.navigate("LocationScreen");
              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#b2dfdb"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Icon
                      as={Entypo}
                      size="lg"
                      name="location"
                      color="#004d40"
                    />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Дэлгүүрийн хаяг, байршил
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"2"}>
            <TouchableHighlight
              underlayColor="#b2dfdb"
              onPress={() => {

              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#b2dfdb"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Icon
                      as={MaterialCommunityIcons}
                      size="lg"
                      name="help-circle-outline"
                      color="#004d40"
                    />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Тусламж, зөвлөгөө
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"2"}>
            <TouchableHighlight
              underlayColor="#b2dfdb"
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(`tel:${86218721}`);
                } else {
                  Linking.openURL(`telprompt:${86218721}`);
                }
              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#b2dfdb"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Icon
                      as={AntDesign}
                      size="lg"
                      name="phone"
                      color="#004d40"
                    />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Холбоо барих
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"2"}>
            <TouchableHighlight
              underlayColor="#d1c4e9"
              onPress={() => {
                onShare();
              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#d1c4e9"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Entypo name="slideshare" size={24} color="#673ab7" />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Найздаа хуваалцах
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"6"}>
            <TouchableHighlight
              underlayColor="#ffcdd2"
              onPress={async () => {
                AsyncStorage.getItem("user_uuid")
                  .then(async (result) => {
                    await AsyncStorage.setItem("user_uuid", "")

                  })
                  .catch((err) => {
                    console.log("user_phone baihgui");
                  });


                await AsyncStorage.getItem("user_phone")
                  .then(async (result) => {
                    console.log(result);
                    await AsyncStorage.setItem("user_phone", "")
                    await navigation.reset({
                      index: 0,
                      routes: [{ name: "LoginScreen" }],
                    });
                  })
                  .catch((err) => {
                    console.log("user_phone baihgui");
                  });



              }}
              style={{
                width: wp("96%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: 60,
              }}
            >
              <Box
                backgroundColor="#ececec"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <HStack alignItems="center" justifyContent={"center"}>
                  <Box
                    backgroundColor={"#ffcdd2"}
                    width={12}
                    borderRadius={"sm"}
                    height={12}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Icon
                      as={Feather}
                      size="lg"
                      name="log-out"
                      color="#ef5350"
                    />
                  </Box>
                  <Text width={"80%"} fontSize={"md"} color="#325b77">
                    {"    "}Гарах
                  </Text>
                  <Box justifyContent="center">
                    <AntDesign name="right" size={16} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            </TouchableHighlight>
          </Center>
     
        </Box>
        <Box height={"20%"} justifyContent={"flex-end"}>
          <Box justifyContent={"flex-end"} backgroundColor={"#ececec"}>
            <View>
              <Text textAlign={"center"} color="#192d3b">
                Point Plus LLC © {new Date().getFullYear()}
              </Text>
            </View>
            <Text textAlign={"center"} color="#192d3b" fontSize="xs">
              Аппликейшны хувилбар {appJson.expo.version}
            </Text>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
