import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import uuid from "react-native-uuid";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import axios from "axios";
import Background from "../components/Background";
import Logo from "../components/Logo";

import * as Linking from "expo-linking";

import appJson from "../../app.json";

import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StateContext } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";

import NetInfo from "@react-native-community/netinfo";
import {
  Button,
  VStack,
  Text,
  NativeBaseProvider,
  useToast,
  Input,
  ToastProvider,
  Icon,
  Center,
  Modal,
  Box,
} from "native-base";

export default function LoginScreen({ navigation }) {
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

  const warnToastPassword = useToast();
  const warnToast = useToast();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState({ value: "" });
  const [password, setPassword] = useState({ value: "" });
  const [loginToken, setLoginToken] = useState({ value: "" });
  const [userData, setUserData] = useContext(StateContext);
  const [showModal, setShowModal] = useState(false);
  const [showLoginTokenModal, setShowLoginTokenModal] = useState(false);
  const [versionUpdate, setVersionUpdate] = useState(false);
  const [limitter, setLimitter] = useState(false);
  const [limitterUUID, setLimitterUUID] = useState(true);
  const [userUUID, setUserUUID] = useState(undefined);
  const [passwordSave, SetPasswordSave] = useState(false);
  const [passwordSaveSwitch, SetPasswordSaveSwitch] = useState(false);
  const [passwordSaveLimitter, SetPasswordLimitter] = useState(false);
  const [seeLockPassword, setSeeLockPassword] = useState(false);

  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
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
          title: "Интернет холболт алга",
          placement: "top",
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

      AsyncStorage.getItem("user_password")
        .then((result) => {
          if (result !== null) {
            setPassword({ value: result, error: "" });
            setSeeLockPassword(true);
            SetPasswordSave(true);
            SetPasswordSaveSwitch(true);
          } else {
            setSeeLockPassword(false);
            SetPasswordSave(false);
          }
        })
        .catch((err) => {
          console.log("user_password baihgui");
        });
    });
  };

  const onLoginPressed = () => {
    reactToUpdates();
    InternetCheck();
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);

    if (versionUpdate === false) {
      if (phoneError) {
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
          title: phoneError,
          placement: "top",
        });
        setPhone({ ...phone });
        return;
      }
      if (passwordError) {
        warnToastPassword.show({
          backgroundColor: "red.400",
          px: "2",
          py: "1",
          rounded: "sm",
          height: "50",
          width: "250",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          title: passwordError,
          placement: "top",
        });
        setPassword({ ...password });
        return;
      }

      if (phone.value !== "" && password.value !== "") {
        var request = JSON.stringify({
          phone: parseInt(phone.value),
          password: password.value,
          uuid: userUUID,
        });

        var config = {
          method: "POST",
          url: `${baseUrl}/wallets/login`,
          headers: {
            "Content-Type": "application/json",
          },
          maxRedirects: 0,
          data: request,
        };

        if (limitter === false) {
          axios(config)
            .then(function (response) {
              if (response.data.wallets.LoginLock === false) {
                if (passwordSave === true) {
                  AsyncStorage.setItem("user_phone", phone.value)
                    .then(() => {
                      SetPasswordSave(true);
                    })
                    .catch(() => console.log("phone error"));
                  AsyncStorage.setItem("user_password", password.value)
                    .then(() => {
                      SetPasswordSave(true);
                    })
                    .catch(() => console.log("password error"));
                }
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
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Dashboard" }],
                });
              } else {
                setLimitter(true);
                setShowLoginTokenModal(true);
              }
            })
            .catch(function (error) {
              warnToast.show({
                backgroundColor: "red.400",
                px: "2",
                py: "1",
                rounded: "sm",
                height: "50",
                width: "300",
                fontSize: 18,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                title: "Утасны дугаар эсвэл нууц үг буруу",
                placement: "top",
              });
            });
        } else {
          setShowLoginTokenModal(true);
        }
      }
    } else {
      reactToUpdates();
    }
  };
  const onLoginAuthPressed = () => {
    reactToUpdates();
    InternetCheck();

    if (loginToken.value !== "") {
      var requestToken = JSON.stringify({
        phone: parseInt(phone.value),
        password: password.value,
        loginToken: loginToken.value,
      });

      var config = {
        method: "POST",
        url: `${baseUrl}/wallets/loginauth`,
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 0,
        data: requestToken,
      };
      axios(config)
        .then(function (response) {
          if (response.data.wallets.LoginLock === false) {
            setShowLoginTokenModal(false);
            setLimitter(false);
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
            navigation.reset({
              index: 0,
              routes: [{ name: "Dashboard" }],
            });
          }
        })
        .catch(function (error) {
          warnToast.show({
            backgroundColor: "red.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "300",
            fontSize: 18,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Баталгаажуулах код буруу",
            placement: "top",
          });
        });
    } else {
      warnToast.show({
        backgroundColor: "red.400",
        px: "2",
        py: "1",
        rounded: "sm",
        height: "50",
        width: "300",
        fontSize: 18,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        title: "Баталгаажуулах кодыг оруулна уу",
        placement: "top",
      });
    }
  };
  if (
    passwordSave === false &&
    passwordSaveSwitch === true &&
    passwordSaveLimitter === false
  ) {
    AsyncStorage.removeItem("user_phone")
      .then(() => {
        setPhone({ value: "" });
        setSeeLockPassword(false);
        SetPasswordSave(false);
      })
      .catch(() => console.log("phone error"));
    AsyncStorage.removeItem("user_password")
      .then(() => {
        SetPasswordSave(false);
        setPassword({ value: "" });
        setSeeLockPassword(false);
      })
      .catch(() => console.log("password error"));
    SetPasswordLimitter(true);
  }

  useEffect(() => {
    SetPasswordSave(false);
    SetPasswordSaveSwitch(false);
    SetPasswordLimitter(false);
    setSeeLockPassword(false);
    setUserUUID(undefined);
    setLimitter(false);
    setShowLoginTokenModal(false);
    setShowModal(false);
    reactToUpdates();
    setShow(false);
    InternetCheck();
    setPhone({ value: "" });
    setPassword({ value: "" });
    setLoginToken({ value: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#1B98F5" />
      <ToastProvider>
        <Center>
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
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("ForgetPasswordScreen")
                          }
                        >
                          <Text style={styles.forgot}>
                            Нууц үгээ мартсан уу?
                          </Text>
                        </TouchableOpacity>
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
        </VStack>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgot: {
    fontWeight: "bold",
    paddingTop: 4,
    fontSize: 14,
    color: theme.colors.secondary,
  },
});
