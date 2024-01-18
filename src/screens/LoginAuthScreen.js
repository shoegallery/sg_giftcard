import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";


import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Linking from "expo-linking";

import appJson from "../../app.json";

import { StateContext } from "../Context/StateContext";

import { Ionicons } from "@expo/vector-icons";

import NetInfo from "@react-native-community/netinfo";

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
  Button
} from "native-base";


import { useTheme } from "../features/theme";
export default function LoginAuthScreen({ navigation }) {
  const theme = useTheme();
  const reactToUpdates = () => {
    var dataVersion = JSON.stringify({});
    var configVersion = {
      method: "post",
      url: `${baseUrl}/wallets/version`,
      headers: {
        "Content-Type": "application/json",
      },
      data: dataVersion,
    };
    axios(configVersion)
      .then(function (response) {
        if (Platform.OS === "android") {
          if (appJson.expo.version !== response.data.android) {
            setShowModal(true);
            setVersionUpdate(true);
          } else {
            setShowModal(false);
            setVersionUpdate(false);
          }
        } else if (Platform.OS === "ios") {
          if (appJson.expo.version !== response.data.ios) {
            setShowModal(true);
            setVersionUpdate(true);
          } else {
            setShowModal(false);
            setVersionUpdate(false);
          }
        }
      })
      .catch(function (error) { });
  };

  const warnToast = useToast();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState({ value: "" });
  const [password, setPassword] = useState({ value: "" });
  const [loginToken, setLoginToken] = useState({ value: "" });
  const [userData, setUserData] = useContext(StateContext);
  const [showModal, setShowModal] = useState(false);

  const [versionUpdate, setVersionUpdate] = useState(false);
  const [limitter, setLimitter] = useState(false);

  const [userUUID, setUserUUID] = useState(undefined);
  const [passwordSave, SetPasswordSave] = useState(false);
  const [passwordSaveSwitch, SetPasswordSaveSwitch] = useState(false);
  const [seeLockPassword, setSeeLockPassword] = useState(false);

  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Уучлаарай",
          textBody: "Интернет холболт алга байна. Шалгана уу.",
          button: "Okey",

          onPressButton: () => {
            Dialog.hide();
          },
        });
      }
      AsyncStorage.getItem("user_uuid")
        .then((result) => {
          if (result === null) {
            AsyncStorage.setItem("user_uuid", uuid.v4())
              .then(() => console.log("uuid ok"))
              .catch(() => console.log("uuid error"));
          } else {
            AsyncStorage.getItem("user_uuid")
              .then((result) => {
                setUserUUID(result);
              })
              .catch(() => {
                console.log("uuid baihgui");
              });
          }
        })
        .catch((err) => {
          console.log("uuid error");
        });

      AsyncStorage.getItem("user_phone")
        .then((result) => {
          console.log(result);
          if (result !== null) {
            setPhone({ value: result, error: "" });
            setSeeLockPassword(true);
            SetPasswordSave(true);
            SetPasswordSaveSwitch(true);
          } else {
            setSeeLockPassword(false);
            SetPasswordSave(false);
          }
        })
        .catch((err) => {
          console.log("user_phone baihgui");
        });
    });
  };

  const loginPressedAuth = () => {
    reactToUpdates();
    InternetCheck();

    if (password.value.length === 6) {
      if (password.value !== "" && userUUID !== undefined) {
        var requestToken = JSON.stringify({
          phone: parseInt(phone.value),
          password: password.value,
        });

        var config = {
          method: "POST",
          url: `${baseUrl}/wallets/login`,
          headers: {
            "Content-Type": "application/json",
          },

          data: requestToken,
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
              setUserData(response.data);

              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Success",
                textBody: "Амжилттай нэвтэрлээ",
              });
              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            }
          })
          .catch(function (error) {
            const err = JSON.parse(JSON.stringify(error));
            console.log(err);
            if (err.status === 492) {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Уучлаарай",
                textBody: "Таны хаяг түр блоклогдсон байна.",
                button: "Okey",
                onPressButton: () => {
                  Dialog.hide();
                },
              });
            } else if (err.status === 491) {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Уучлаарай",
                textBody: "Таны хаяг түр блоклогдлоо.",
                button: "Okey",
                onPressButton: () => {
                  Dialog.hide();
                },
              });
            } else if (err.status === 482) {
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Амжилттай",
                textBody: "Таны гар утсанд баталгаажуулах код илгээсэн.",
              });
            } else if (err.status === 481) {
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Амжилттай",
                textBody: "Таны гар утсанд баталгаажуулах код илгээсэн.",
              });
            } else if (err.status === 485) {
              setPassword({ value: "" });
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Уучлаарай",
                textBody: "Баталгаажуулах код буруу.",
                button: "Okey",
                onPressButton: () => {
                  Dialog.hide();
                },
              });
            } else if (err.status === 486) {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Уучлаарай",
                textBody: "Та үйлдэл хийх эрхгүй байна.",
                button: "Okey",
                onPressButton: () => {
                  Dialog.hide();
                },
              });

              navigation.navigate("LoginScreen");
            } else if (err.status === 487) {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Уучлаарай",
                textBody: "Та үйлдэл хийх эрхгүй байна.",
                button: "Okey",
                onPressButton: () => {
                  Dialog.hide();
                },
              });

              navigation.navigate("LoginScreen");
            }
          });
      }
    }
  };
  useEffect(() => {
    setLimitter(false);
    setShowModal(false);
    reactToUpdates();
    setShow(false);
    InternetCheck();
    setPhone({ value: "86218721" });
    setPassword({ value: "" });
    setLoginToken({ value: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <StatusBar barStyle={theme.status} backgroundColor={theme.background} />
      <ToastProvider>
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View
            style={{ height: hp("60%"), backgroundColor: "white" }}
          >
            <Box height={"100%"} justifyContent="center">
              <Center>

                <Text
                  maxWidth={"90%"}
                  marginTop={1}
                  color={theme.textSecond}
                  fontSize="md"
                  textAlign={"center"}
                >
                  Таны (+976 {phone.value[0]}{phone.value[1]}{phone.value[2]}{phone.value[3]} {phone.value[4]}{phone.value[5]}{phone.value[6]}{phone.value[7]}) дугаарт мессежээр ирсэн баталгаажуулах кодыг бичнэ үү.
                </Text>
                <View style={{ marginTop: 20, width: wp("90%"), alignContent: "center" }}>
                  <View style={{ marginTop: 5, justifyContent: "center", backgroundColor: "white", height: wp("15%"), width: wp("90%"), alignContent: "center" }}><Box
                    margin={1}
                    marginLeft={1 / 2}
                    width="100%"
                  >

                  </Box>
                    <Box><HStack borderRadius="lg" justifyContent={"center"} >
                      <Box
                        borderRadius="lg"
                        justifyContent="center"
                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}

                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[0] !== undefined ? password.value[0] : ""}
                            </Text>
                          </Center>
                        </VStack>
                      </Box>
                      <Box
                        borderRadius="lg"
                        justifyContent="center"
                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[1] !== undefined ? password.value[1] : ""}
                            </Text>
                          </Center>
                        </VStack>

                      </Box>
                      <Box
                        borderRadius="lg"
                        justifyContent="center"
                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}

                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[2] !== undefined ? password.value[2] : ""}
                            </Text>
                          </Center>
                        </VStack>

                      </Box>
                      <Box
                        borderRadius="lg"
                        justifyContent="center"
                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}

                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[3] !== undefined ? password.value[3] : ""}
                            </Text>
                          </Center>
                        </VStack>

                      </Box>
                      <Box
                        borderRadius="lg"
                        justifyContent="center"
                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}

                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[4] !== undefined ? password.value[4] : ""}
                            </Text>
                          </Center>
                        </VStack>

                      </Box>
                      <Box
                        borderRadius="lg"
                        justifyContent="center"

                        width={wp("15%")}
                        paddingRight={1}
                        paddingTop={1}
                        paddingBottom={1}
                        paddingLeft={1}

                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="white"
                          borderColor={password.value.length === 6 ? "#D4D4D4" : "#FF9FAF"}
                          borderWidth={2}
                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              {password.value[5] !== undefined ? password.value[5] : ""}
                            </Text>
                          </Center>
                        </VStack>

                      </Box>
                    </HStack></Box></View>

                </View>
              </Center>
              <Box

                borderWidth={0}
                borderColor={"white"}
                width="100%"
                alignSelf="center"
                justifyContent="center"
                marginTop={5}
                style={{

                }}
              >
                <View style={{
                  backgroundColor: password.value.length === 6 ? "#6172F3" : "#F5F5F5",
                  borderRadius: 6,
                  height: hp("8%"),
                  width: wp("90%"),
                  alignSelf: "center"
                }}><Center>
                    <TouchableOpacity
                      onPress={() => { loginPressedAuth() }}
                      style={{
                        height: hp("8%"),
                        width: wp("90%"),
                      }}

                    >
                      <Box height={"100%"} justifyContent={"center"}>
                        <Text
                          alignItems={"center"}
                          textAlign={"center"}
                          color={password.value.length === 6 ? "#FFFFFF" : "#A2A2A2"}
                          fontSize="2xl"
                        >
                          Нэвтрэх
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Center></View>

              </Box>

            </Box>
          </View>
          <View style={{ height: hp("40%") , position: "relative", flexDirection: "column", backgroundColor: "#E5E5E5", justifyContent: "flex-end" }}>
            <Center justifyContent="flex-end" alignSelf="center" width="100%">
              <VStack marginTop={2} marginBottom={2}>
                <View style={{ height: hp("9%") }}>
                  <HStack borderRadius="lg" paddingLeft={3} paddingRight={3} backgroundColor={"#E5E5E5"}>
                    <Box
                      borderRadius="lg"
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity
                        underlayColor={"#A2A2A2"}
                        borderRadius="lg"
                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "1" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"

                        >
                          <Center justifyItems={"center"}>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              1
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "2" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              2
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "3" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              3
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                  </HStack>
                </View>
                <View style={{ height: hp("9%") }}>
                  <HStack paddingLeft={3} paddingRight={3} backgroundColor={"#E5E5E5"}>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "4" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              4
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity


                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "5" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"


                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              5
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "6" });
                          }
                        }}
                      >
                        <VStack


                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              6
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                  </HStack>
                </View>
                <View style={{ height: hp("9%") }}>
                  <HStack paddingLeft={3} paddingRight={3} backgroundColor={"#E5E5E5"}>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "7" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              7
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "8" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              8
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "9" });
                          }
                        }}
                      >
                        <VStack>
                          <Center
                            justifyContent="center"
                            height="100%"
                            width="100%"
                            borderRadius="lg"
                            backgroundColor="#FFFFFF"
                          >
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              9
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                  </HStack>
                </View>
                <View style={{ height: hp("9%"), marginBottom: 2, backgroundColor: "#E5E5E5" }}>
                  <HStack paddingLeft={3} paddingRight={3} backgroundColor={"#E5E5E5"}>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => { }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#D4D4D4"
                        >
                          <Center>
                            <Text
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              .
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}

                      background="#E5E5E5"
                    >
                      <TouchableOpacity

                        onPress={() => {
                          if (password.value.length < 6) {
                            setPassword({ value: password.value + "0" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#FFFFFF"
                        >
                          <Center>
                            <Text
                              textAlign={"center"}


                              backgroundColor={"amber.300"}
                              fontSize="2xl"
                              color={theme.text}
                              fontFamily="regular"
                            >
                              0
                            </Text>
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      width="1/3"
                      paddingLeft={1}
                      paddingRight={1}
                      paddingTop={1}
                      paddingBottom={1}
                      background="#E5E5E5"

                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            password.value.length < 7 &&
                            password.value.length > 0
                          ) {

                            setPassword({
                              value: password.value.substr(
                                0,
                                password.value.length - 1
                              ),
                            });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          borderRadius="lg"
                          backgroundColor="#D4D4D4"

                        >
                          <Center>
                            <Ionicons
                              name="caret-back"
                              size={30}
                              color={theme.text}
                            />
                          </Center>
                        </VStack>
                      </TouchableOpacity>
                    </Box>
                  </HStack>
                </View>
              </VStack>
            </Center>
          </View>
          <Center>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              _backdrop={{
                bg: "coolGray.800",
              }}
            >
              <Modal.Content width="90%">
                <Modal.Body width="100%" maxWidth="100%">
                  Shoe Gallery Wallet апп-д шинэ хувилбар гарсан байна. Илүү
                  олон, Илүү шинэ боломжууд бий болсон байна. Хэрэглэгч та
                  заавал аппаа шинэчилж ашиглана уу.
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      width={"100%"}
                      onPress={() => {
                        if (Platform.OS === "android") {
                          Linking.openURL(
                            "https://play.google.com/store/apps/details?id=com.shoegallery.sg_wallet_app"
                          );
                        } else if (Platform.OS === "ios") {
                          Linking.openURL(
                            "https://apps.apple.com/us/app/shoegallery-wallet/id1631641856"
                          );
                        }
                      }}
                    >
                      Апп шинэчлэх
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </View>
      </ToastProvider>
    </NativeBaseProvider>
  );
}
