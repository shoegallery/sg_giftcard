import React, { useRef, useEffect, useState,useContext } from "react";
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
import * as Haptics from 'expo-haptics';
import NumberFormat from "react-number-format";
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
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StateContext, StateContextHistory } from "../Context/StateContext";

import {
  VStack,
  Text,
  NativeBaseProvider,
  useToast,
  ToastProvider,
  Center,
  Box,
  HStack,
  Modal,
  Button,
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const PurchaseScreen = ({ navigation }) => {
  const [userData, setUserData] = useContext(StateContext);
  const [phone, setPhone] = useState({ value: "" });
  console.log(phone);
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
    <View style={{ justifyContent: "center", alignContent: "center" }}>
      <View style={{ height: hp("60%") - 50, backgroundColor: "#ececec" }}>
        <Box height={"100%"}>
          <Center>
          <NumberFormat
                        value={userData.wallets.balance.$numberDecimal}
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(formattedValue) => (
                          <Text
                          paddingTop={5} maxWidth={"90%"} color="#424242" fontSize="sm"
                          >
                           Боломжит үлдэгдэл: {formattedValue}₮
                          </Text>
                        )}
                      />
            <HStack
              marginTop={5}
              height="16"
              width="xs"
              justifyContent="center"
            >
              <Box
                borderRadius="sm"
                margin={1}
                marginLeft={1 / 2}
                width="100%"
                justifyContent="center"
                backgroundColor="#ececec"
                shadow={"4"}
              >
                <Center>
                  <VStack>
                    <Text fontSize="3xl" fontFamily="bold" color="#325b77">
                      {phone.value}
                    </Text>
                  </VStack>
                </Center>
              </Box>
            </HStack>
            <HStack
              marginTop={5}
              height="16"
              width="xs"
              justifyContent="center"
            >
              <Box
                margin={1}
                marginRight={1 / 2}
                width="30%"
                justifyContent="center"
                backgroundColor="#65a3cc"
                borderRadius="sm"
              >
                <Center>
                  <VStack>
                    <Text fontSize="3xl" fontFamily="bold" color="white">
                      Дүн
                    </Text>
                  </VStack>
                </Center>
              </Box>
              <Box
                borderRadius="sm"
                margin={1}
                marginLeft={1 / 2}
                width="70%"
                justifyContent="center"
                backgroundColor="#ececec"
                shadow={"4"}
              >
                <Center>
                  <VStack>
                    {phone.value === "" ? (
                      <Text fontSize="3xl" fontFamily="bold" color="#325b77">
                        0₮
                      </Text>
                    ) : (
                      <NumberFormat
                        value={phone.value}
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(formattedValue) => (
                          <Text
                            fontSize="3xl"
                            fontFamily="bold"
                            color="#325b77"
                          >
                            {formattedValue}₮
                          </Text>
                        )}
                      />
                    )}
                  </VStack>
                </Center>
              </Box>
            </HStack>
            <TouchableOpacity onPress={() => {}}>
              <Box
                paddingTop={2}
                borderWidth={0}
                borderColor={"white"}
                width={"xs"}
                alignSelf="center"
                justifyContent="center"
                marginTop={5}
              >
                <Center>
                  <TouchableHighlight
                    underlayColor="#bad6e8"
                    style={{
                      borderRadius: 30,
                      height: hp("7%"),
                      width: wp("70%"),
                      backgroundColor: "#5499c7",
                    }}
                  >
                    <Box height={"100%"} justifyContent={"center"}>
                      <Text
                        alignItems={"center"}
                        textAlign={"center"}
                        color="white"
                        fontSize="2xl"
                      >
                        Төлөх
                      </Text>
                    </Box>
                  </TouchableHighlight>
                </Center>
              </Box>
            </TouchableOpacity>
          </Center>
        </Box>
      </View>

      <View style={{ height: hp("40%"), justifyContent: "flex-end" }}>
        <Center justifyContent="flex-end" alignSelf="center" width="100%">
          <VStack>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "1" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          1
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "2" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          2
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "3" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          3
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  minH={"16"}
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "4" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          4
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "5" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          5
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "6" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          6
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "7" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          7
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "8" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          8
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "9" });
                      }
                    }}
                  >
                    <VStack>
                      <Center
                        justifyContent="center"
                        height="100%"
                        width="100%"
                      >
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          9
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {}}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          .
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 8) {
                        setPhone({ value: phone.value + "0" });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          0
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (phone.value.length < 9 && phone.value.length > 0) {
                        setPhone({
                          value: phone.value.substr(0, phone.value.length - 1),
                        });
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Ionicons name="caret-back" size={30} color="#2a4c63" />
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
          </VStack>
        </Center>
      </View>
    </View>
  );
};

export default PurchaseScreen;
