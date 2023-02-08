import { baseUrl } from "../baseUrl";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
  UIManager,
  TouchableOpacity,
  TouchableHighlight, SafeAreaView, ScrollView, StatusBar
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  Image,
  useToast,
  Center,
  Select,

} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";

const Tab = createBottomTabNavigator();
export default function ProfileScreen({ navigation }, props) {
  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />
      <ScrollView showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
      >
        <Box height={"100%"} backgroundColor={"#ececec"} >
          <Center>
            <Image
              marginTop={30}
              size={"32"}
              borderWidth={"8"}
              border
              borderColor={"#424242"}
              borderRadius={"full"}
              source={{
                uri: "https://wallpaperaccess.com/full/317501.jpg",
              }}
              alt="Alternate Text"
            />
          </Center>
          <Center paddingTop={"3"}>
            <Text color="#325b77" fontSize={"xl"} bold>
              Овог НЭРБАЙНА
            </Text>
          </Center>
          <Center paddingTop={"6"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Хэрэглэгчийн мэдээлэл
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"3"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Үйлчилгээний нөхцөл
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"6"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Брэндийн танилцуулга
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"3"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Дэлгүүрийн хаяг, байршил
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"3"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Тусламж, зөвлөгөө
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
          <Center paddingTop={"3"} paddingBottom={"6"}>
            <TouchableHighlight
              underlayColor="#fafafa"
              onPress={() => {
                console.log("first");
              }}
              style={{
                width: wp("85%"),
                borderRadius: hp("1%"),
                justifyContent: "center",
                height: hp("9%"),
              }}
            >
              <Box
                backgroundColor="#424242"
                h={"100%"}
                w="100%"
                borderRadius={"md"}
                justifyContent={"center"}
              >
                <Text paddingLeft={"4"} fontSize={"md"} color="#fafafa">
                  Холбоо барих
                </Text>
              </Box>
            </TouchableHighlight>
          </Center>
        </Box>
      </ScrollView></SafeAreaView>

  );
}
