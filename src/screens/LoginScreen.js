import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import uuid from "react-native-uuid";

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
  ToastProvider,
  Center,
  Box,
  HStack,
  Modal,
  Button,
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useTheme } from "../features/theme";
export default function LoginScreen({ navigation }) {
  const theme = useTheme();

  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState({ value: "" });

  const [userData, setUserData] = useContext(StateContext);
  const [showModal, setShowModal] = useState(false);

  const [versionUpdate, setVersionUpdate] = useState(false);

  const [userUUID, setUserUUID] = useState(undefined);

  const [seeLockPassword, setSeeLockPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true);
      loginPressed();

      setTimeout(() => {
        setIsPressed(false);
      }, 10000); // Set a timeout to enable button presses after a specific duration (e.g., 1 second)
    }
  };

  const loginPressed = () => {
    reactToUpdates();
    InternetCheck();
    console.log("first");
    if (versionUpdate !== true) {
      if (phone.value !== "" && userUUID !== undefined) {
        let requestToken = JSON.stringify({
          phone: parseInt(phone.value),
          uuid: userUUID,
        });
        let config = {
          method: "POST",
          url: `${baseUrl}/wallets/create`,
          headers: {
            "Content-Type": "application/json",
          },
          maxRedirects: 0,
          data: requestToken,
        };
        AsyncStorage.setItem("user_phone", phone.value);
        axios(config)
          .then(function (response) {
            if (showModal === false) {
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
            AsyncStorage.setItem("user_phone", phone.value)
              .then(() => {})
              .catch(() => console.log("password"));
            const err = JSON.parse(JSON.stringify(error));
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
            } else {
              if (err.status === 482) {
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
              } else if (err.status === 480) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: "Амжилттай",
                  textBody: "Таны гар утсанд баталгаажуулах код илгээсэн.",
                });
              } else if (err.status === 499) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: "Амжилттай",
                  textBody: "Таны гар утсанд баталгаажуулах код илгээсэн.",
                });
              }
              navigation.navigate("LoginAuthScreen");
            }
          });
      }
    }
  };
  const autoLogin = () => {
    reactToUpdates();
    InternetCheck();
    if (versionUpdate !== true) {
      if (phone.value !== "" && userUUID !== undefined) {
        let requestToken = JSON.stringify({
          phone: parseInt(phone.value),
          uuid: userUUID,
        });

        let config = {
          method: "POST",
          url: `${baseUrl}/wallets/create`,
          headers: {
            "Content-Type": "application/json",
          },
          maxRedirects: 0,
          data: requestToken,
        };

        axios(config)
          .then(function (response) {
            if (showModal === false) {
              setUserData(response.data);
              warnToast.show({
                backgroundColor: "emerald.400",
                px: "2",
                py: "1",
                rounded: "sm",
                height: "50",
                width: "300",
                fontSize: 20,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                title: "Амжилттай нэвтэрлээ",
                placement: "top",
              });

              AsyncStorage.setItem("user_phone", phone.value);

              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            }
          })
          .catch(function (error) {
            AsyncStorage.setItem("user_phone", phone.value)
              .then(() => {})
              .catch(() => console.log("password"));
            const err = JSON.parse(JSON.stringify(error));
            if (err.status === 492) {
              warnToast.show({
                backgroundColor: "red.400",
                px: "2",
                py: "1",
                rounded: "sm",
                height: "50",
                width: "250",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                title: "Таны хаяг түр блоклогдсон байна.",
                placement: "top",
              });
            } else if (err.status === 491) {
              warnToast.show({
                backgroundColor: "red.400",
                px: "2",
                py: "1",
                rounded: "sm",
                height: "50",
                width: "250",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                title: "Таны хаяг түр блоклогдлоо",
                placement: "top",
              });
            } else {
              if (err.status === 482) {
                warnToast.show({
                  backgroundColor: "emerald.400",
                  px: "2",
                  py: "1",
                  rounded: "sm",
                  height: "50",
                  width: "250",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  title: "Мессеж илгээсэн.",
                  placement: "top",
                });
              } else if (err.status === 481) {
                warnToast.show({
                  backgroundColor: "emerald.400",
                  px: "2",
                  py: "1",
                  rounded: "sm",
                  height: "50",
                  width: "250",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  title: "Мессеж илгээсэн.",
                  placement: "top",
                });
              } else if (err.status === 480) {
                warnToast.show({
                  backgroundColor: "emerald.400",
                  px: "2",
                  py: "1",
                  rounded: "sm",
                  height: "50",
                  width: "250",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  title: "Мессеж илгээсэн.",
                  placement: "top",
                });
              } else if (err.status === 499) {
                warnToast.show({
                  backgroundColor: "emerald.400",
                  px: "2",
                  py: "1",
                  rounded: "sm",
                  height: "50",
                  width: "250",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  title: "Мессеж илгээсэн.",
                  placement: "top",
                });
              }
              navigation.navigate("LoginAuthScreen");
            }
          });
      }
    }
  };
  const reactToUpdates = () => {
    let dataVersion = JSON.stringify({});
    let configVersion = {
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
      .catch(function (error) {});
  };
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
          if (result !== null) {
            setPhone({ value: result, error: "" });
          }
        })
        .catch((err) => {
          console.log("user_phone baihgui");
        });
    });
  };

  useEffect(() => {
    setUserUUID(undefined);
    setShowModal(false);
    reactToUpdates();
    setShow(false);
    InternetCheck();
    setPhone({ value: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <StatusBar barStyle={theme.status} backgroundColor={theme.background} />
      <ToastProvider>
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View
            style={{ height: hp("60%"), backgroundColor: theme.background }}
          >
            <Box height={"100%"} justifyContent="center">
              <Center>
                <Text
                  maxWidth={"90%"}
                  color={theme.text}
                  fontFamily="bold"
                  fontSize="3xl"
                >
                  Нэвтрэх
                </Text>
                <Text
                  maxWidth={"90%"}
                  marginTop={1}
                  color={theme.textSecond}
                  fontSize="sm"
                >
                  Та өөрийн гар утасны дугаарыг оруулна уу
                </Text>
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
                    backgroundColor={theme.main}
                    borderRadius="sm"
                  >
                    <Center>
                      <VStack>
                        <Text
                          fontSize="3xl"
                          fontFamily="bold"
                          color={theme.background}
                        >
                          +976
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
                    backgroundColor={theme.buttonText}
                    shadow={"4"}
                  >
                    <Center>
                      <VStack>
                        <Text
                          fontSize="3xl"
                          fontFamily="bold"
                          color={theme.main}
                        >
                          {phone.value[0] !== undefined ? phone.value[0] : "-"}
                          {phone.value[1] !== undefined ? phone.value[1] : "-"}
                          {phone.value[2] !== undefined ? phone.value[2] : "-"}
                          {phone.value[3] !== undefined
                            ? phone.value[3]
                            : "-"}{" "}
                          {phone.value[4] !== undefined ? phone.value[4] : "-"}
                          {phone.value[5] !== undefined ? phone.value[5] : "-"}
                          {phone.value[6] !== undefined ? phone.value[6] : "-"}
                          {phone.value[7] !== undefined ? phone.value[7] : "-"}
                        </Text>
                      </VStack>
                    </Center>
                  </Box>
                </HStack>
              </Center>
              <TouchableOpacity onPress={handlePress} disabled={isPressed}>
                <Box
                  paddingTop={2}
                  borderWidth={0}
                  borderRadius="2xl"
                  borderColor={"white"}
                  width={"xs"}
                  alignSelf="center"
                  justifyContent="center"
                  marginTop={5}
                  style={{
                    display: phone.value.length === 8 ? "flex" : "none",
                  }}
                >
                  <Center>
                    <TouchableHighlight
                      underlayColor={theme.overlay}
                      style={{
                        borderRadius: 30,
                        height: hp("7%"),
                        width: wp("70%"),
                        backgroundColor: theme.main,
                      }}
                    >
                      <Box height={"100%"} justifyContent={"center"}>
                        <Text
                          alignItems={"center"}
                          textAlign={"center"}
                          color={theme.buttonText}
                          fontSize="2xl"
                        >
                          Үргэлжлүүлэх
                        </Text>
                      </Box>
                    </TouchableHighlight>
                  </Center>
                </Box>
              </TouchableOpacity>
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "1" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "2" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "3" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      minH={"16"}
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "4" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "5" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "6" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "7" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "8" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
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
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {}}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (phone.value.length < 8) {
                            setPhone({ value: phone.value + "0" });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Text
                              fontSize="3xl"
                              color={theme.text}
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
                      borderColor={theme.border}
                      borderWidth={1 / 4}
                      width="1/3"
                      backgroundColor={theme.background}
                    >
                      <TouchableHighlight
                        underlayColor={theme.overlay}
                        onPress={() => {
                          if (
                            phone.value.length < 9 &&
                            phone.value.length > 0
                          ) {
                            setPhone({
                              value: phone.value.substr(
                                0,
                                phone.value.length - 1
                              ),
                            });
                          }
                        }}
                      >
                        <VStack
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <Center>
                            <Ionicons
                              name="caret-back"
                              size={30}
                              color={theme.text}
                            />
                          </Center>
                        </VStack>
                      </TouchableHighlight>
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
