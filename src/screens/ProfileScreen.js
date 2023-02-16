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
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome, Octicons
} from "@expo/vector-icons";
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
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />
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
      <Box height={"90%"}><Box width={"100%"} backgroundColor={"#ececec"}>
        <Center>
          <Image
            marginTop={30}
            size={"32"}
            borderWidth={"8"}
            border
            borderColor={"#ececec"}
            borderRadius={"full"}
            source={{
              uri: "https://wallpaperaccess.com/full/317501.jpg",
            }}
            alt="Alternate Text"
          />
        </Center>
        <Center>
          <Text color="#325b77" fontSize={"xl"} bold>
            Овог НЭРБАЙНА
          </Text>
        </Center>
        <Center>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              console.log("first");
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Box >
                  <Icon
                    as={MaterialCommunityIcons}
                    width={"xl"}
                    size="xl"
                    name="license"
                    color="#1B3241"
                  />
                </Box>
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Хэрэглэгчийн мэдээлэл
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight>
        </Center>
        <Center>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              navigation.navigate("Үйлчилгээний нөхцөл");
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon
                  width={"30%"}
                  as={AntDesign}
                  size="xl"
                  name="book"
                  color="#1B3241"
                />
                <Text width={"70%"} fontSize={"md"} color="#325b77">
                  {"    "}Үйлчилгээний нөхцөл
                </Text>
              </HStack>
            </Box>

          </TouchableHighlight>
        </Center>
        <Center paddingTop={4}>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              console.log("first");
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon as={Octicons} size="xl" name="star" color="#1B3241" />
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Брэндийн танилцуулга
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight>
        </Center>
        <Center>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              console.log("first");
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon as={Entypo} size="xl" name="location" color="#1B3241" />
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Дэлгүүрийн хаяг, байршил
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight>
        </Center>
        <Center>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              console.log("first");
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon
                  as={MaterialCommunityIcons}
                  size="xl"
                  name="help-circle-outline"
                  color="#1B3241"
                />
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Тусламж, зөвлөгөө
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight>
        </Center>
        <Center>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              if (Platform.OS === "android") {
                Linking.openURL(`tel:${80409000}`);
              } else {
                Linking.openURL(`telprompt:${80409000}`);
              }
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon as={AntDesign} size="xl" name="phone" color="#1B3241" />
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Холбоо барих
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight>
        </Center>
        <Center paddingTop={4}>
          <TouchableHighlight
            underlayColor="#bad6e8"
            onPress={() => {
              if (Platform.OS === "android") {
                Linking.openURL(`tel:${80409000}`);
              } else {
                Linking.openURL(`telprompt:${80409000}`);
              }
            }}
            style={{
              width: wp("100%"),
              borderRadius: hp("1%"),
              justifyContent: "center",
              height: hp("8%"),
            }}
          >
            <Box
              backgroundColor="#ececec"
              h={"100%"}
              w="100%"
              borderRadius={"md"}
              justifyContent={"center"}
            >
              <HStack paddingLeft={"8"}>
                <Icon as={Feather} size="xl" name="log-out" color="#1B3241" />
                <Text fontSize={"md"} color="#325b77">
                  {"    "}Гарах
                </Text>
              </HStack>
            </Box>
          </TouchableHighlight></Center></Box>
        <Box backgroundColor={"#ececec"} height={"10%"}><View>
          <Text textAlign={"center"} color="#192d3b" justifyItems="end">
            Shoe Gallery LLC © {new Date().getFullYear()}
          </Text>
        </View>
          <Text
            textAlign={"center"}
            color="#192d3b"
            fontSize="xs"
            justifyItems="end"
          >
            Аппликейшны хувилбар {appJson.expo.version}
          </Text></Box>
      </Box>
    </SafeAreaView>
  );
}
