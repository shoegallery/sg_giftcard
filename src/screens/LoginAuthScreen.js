import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import uuid from "react-native-uuid";

import axios from "axios";

import appJson from "../../app.json";


import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

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
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function LoginAuthScreen({ navigation }) {
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
      .catch(function (error) {});
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
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />
      <ToastProvider>
        <View backgroundColor="#424242">
          <View
            style={{
              height: hp("60%"),
              justifyContent: "center",
              backgroundColor: "#ececec",
            }}
          >
            <Center>
              <Text
                maxWidth={"90%"}
                textAlign="center"
                color="#5499c7"
                fontFamily="bold"
                fontSize="3xl"
              >
                Баталгаажуулах код
              </Text>
              <Text
                maxWidth={"90%"}
                textAlign="center"
                marginTop={1}
                color="#424242"
                fontSize="sm"
              >
                Таны гар утсанд мессежээр ирсэн 6 оронтой тоог оруулна уу
              </Text>
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
                  width="70%"
                  justifyContent="center"
                  backgroundColor="#ececec"
                  shadow={"4"}
                >
                  <Center>
                    <VStack>
                      <Text fontSize="3xl" fontFamily="bold" color="#325b77">
                        {password.value[0] !== undefined
                          ? password.value[0]
                          : "-"}
                        {password.value[1] !== undefined
                          ? password.value[1]
                          : "-"}
                        {password.value[2] !== undefined
                          ? password.value[2]
                          : "-"}{" "}
                        {password.value[3] !== undefined
                          ? password.value[3]
                          : "-"}
                        {password.value[4] !== undefined
                          ? password.value[4]
                          : "-"}
                        {password.value[5] !== undefined
                          ? password.value[5]
                          : "-"}
                      </Text>
                    </VStack>
                  </Center>
                </Box>
              </HStack>
            </Center>
            <TouchableOpacity
              onPress={() => {
                loginPressedAuth();
              }}
            >
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
                  display: password.value.length === 6 ? "flex" : "none",
                }}
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
                        Болсон
                      </Text>
                    </Box>
                  </TouchableHighlight>
                </Center>
              </Box>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: hp("40%"),
              backgroundColor: "red",
              justifyContent: "flex-end",
            }}
          >
            <Center alignSelf="center" width="100%">
              <VStack>
                <View style={{ height: hp("10%") }}>
                  <HStack>
                    <Box
                      borderRadius={0}
                      justifyContent="center"
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      minH={"16"}
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
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
                      borderColor="#353b48"
                      borderWidth={1 / 3}
                      width="1/3"
                      backgroundColor="#ececec"
                    >
                      <TouchableHighlight
                        underlayColor="#f8f8f8"
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
                        >
                          <Center>
                            <Ionicons
                              name="caret-back"
                              size={30}
                              color="#2a4c63"
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

          {/* <Center>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            _backdrop={{
              bg: "coolGray.800",
            }}
          >
            <Modal.Content maxWidth="90%" height="300" maxH="300">
              <Modal.Header>Шинэ хувилбар</Modal.Header>
              <Modal.Body
                width="100%"
                maxWidth="100%"
                size="xs"
                height="200"
                maxH="200"
              >
                Shoe Gallery Wallet апп-д шинэ хувилбар гарсан байна. Илүү олон,
                Илүү шинэ боломжууд бий болсон байна. Хэрэглэгч та заавал аппаа
                шинэчилж ашиглана уу.
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
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

        <Center>
          <Modal
            isOpen={showLoginTokenModal}
            onClose={() => setShowLoginTokenModal(false)}
            _backdrop={{
              bg: "coolGray.800",
            }}
          >
            <Modal.Content maxWidth="90%" height={"300"} maxH="400">
              <Modal.Header>Хандах зөвшөөрөл өгөх</Modal.Header>
              <Modal.Body>
                <Text>
                  Таны гар утсанд илгээсэн баталгаажуулах кодыг оруулна уу
                </Text>
                <View>
                  <Box>
                    <Input
                      placeholder="Энд кодоо оруулна уу"
                      marginTop={5}
                      fontSize={20}
                      returnKeyType="done"
                      onChangeText={(tokenCode) =>
                        setLoginToken({
                          value: tokenCode,
                          error: "",
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </Box>
                </View>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={5}>
                  <Button
                    onPress={() => {
                      setShowModal(false);
                      onLoginAuthPressed();
                    }}
                  >
                    <Text bold color="white">
                      Нэвтрэх
                    </Text>
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Center>
        <VStack>
          <Background>
            <VStack>
              <Center>
                <Logo
                  style={{
                    width: wp("25%"),
                    heigth: wp("25%"),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </Center>
            </VStack>
            <SafeAreaView
              style={{
                justifyContent: "flex-start",
                width: "100%",
                height: hp("50%"),
              }}
            >
              <Input
                w={{
                  base: "100%",
                  md: "25%",
                }}
                h={16}
                fontSize={24}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="phone" />}
                    size={8}
                    ml="2"
                    color="muted.400"
                  />
                }
                placeholder="Утасны дугаар"
                returnKeyType="next"
                textContentType="telephoneNumber"
                keyboardType="number-pad"
                value={phone.value}
                onChangeText={(number) => {
                  setPhone({ value: number, error: "" });
                  if (
                    passwordSaveSwitch === true &&
                    passwordSave === true &&
                    seeLockPassword === true
                  ) {
                    SetPasswordSave(false);
                  }
                }}
              />

              <Input
                mt={"5%"}
                w={{
                  base: "100%",
                  md: "25%",
                }}
                h={16}
                fontSize={24}
                type={show ? "text" : "password"}
                InputRightElement={
                  seeLockPassword === false ? (
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      size={8}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShow(!show)}
                    />
                  ) : (
                    <View></View>
                  )
                }
                placeholder="Нууц үг"
                label="Нууц үг"
                returnKeyType="done"
                textContentType="password"
                keyboardType="default"
                value={password.value}
                onChangeText={(text) => {
                  setPassword({ value: text, error: "" });
                  if (
                    passwordSaveSwitch === true &&
                    passwordSave === true &&
                    seeLockPassword === true
                  ) {
                    SetPasswordSave(false);
                  }
                }}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <View style={{ flex: 4 }}>
                      <BouncyCheckbox
                        isChecked={passwordSave}
                        size={20}
                        fillColor="#1B98F5"
                        unfillColor="#FFFFFF"
                        text="Нууц үг сануулах"
                        iconStyle={{ borderColor: "#1B98F5" }}
                        textStyle={{
                          color: "#1B98F5",
                          textDecorationLine: "none",
                          fontWeight: "bold",
                        }}
                        disableBuiltInState
                        onPress={() => SetPasswordSave(!passwordSave)}
                      />
                    </View>
                    <View style={{ flex: 5, marginTop: -5 }}>
                      <View style={styles.forgotPassword}>
                        <TouchableHighlight
                          onPress={() =>
                            navigation.navigate("ForgetPasswordScreen")
                          }
                        >
                          <Text style={styles.forgot}>
                            Нууц үгээ мартсан уу?
                          </Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
              <View style={{ marginVertical: 0, marginTop: 10 }}>
                <Button
                  colorScheme="blue"
                  bg="#1B98F5"
                  size="md"
                  shadow="5"
                  mode="contained"
                  onPress={onLoginPressed}
                >
                  <Text fontSize="xl" bold color="white">
                    Нэвтрэх
                  </Text>
                </Button>
              </View>
              <Button
                colorScheme="blue"
                shadow="5"
                marginTop={hp("2%")}
                bordered
                bg="white"
                margin="0"
                variant="Subtle"
                borderColor="#1B98F5"
                borderWidth="2"
                size="md"
                onPress={() => navigation.navigate("RegisterScreen")}
              >
                <Text fontSize="xl" bold color="#1B98F5">
                  Шинээр бүртгүүлэх
                </Text>
              </Button>
            </SafeAreaView>
            <View
              style={{
                flex: 1,
                marginTop: Platform.OS === "ios" ? "25%" : "35%",
                alignSelf: "center",
              }}
            >
              <Text fontSize="xl" bold color="#1B98F5">
                {appJson.expo.version}
              </Text>
            </View>
          </Background>
        </VStack> */}
        </View>
      </ToastProvider>
    </NativeBaseProvider>
  );
}


