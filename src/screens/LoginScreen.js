import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView, Platform
} from "react-native";

import axios from "axios";
import Background from "../components/Background";
import Logo from "../components/Logo";

import * as Linking from "expo-linking"



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
import * as Updates from "expo-updates";
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
  Modal
} from "native-base";


export default function LoginScreen({ navigation }) {
  const reactToUpdates = async () => {
    var dataVersion = JSON.stringify({
    });

    var configVersion = {
      method: 'post',
      url: `${baseUrl}/wallets/version`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataVersion
    };
    axios(configVersion)
      .then(function (response) {
        if (Updates.manifest.version !== response.data.data) {
          setShowModal(true)
          setVersionUpdate(true)
        }
      })
      .catch(function (error) {

      });
  };

  const warnToastPassword = useToast();
  const warnToast = useToast();
  const [show, setShow] = useState(false);

  const [phone, setPhone] = useState({ value: "" });
  const [password, setPassword] = useState({ value: "" });
  const [userData, setUserData] = useContext(StateContext);
  const [showModal, setShowModal] = useState(false);
  const [versionUpdate, setVersionUpdate] = useState(false);
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
    });
  }


  const onLoginPressed = () => {
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
        return
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
        return
      }

      if (phone.value !== "" && password.value !== "") {
        var request = JSON.stringify({
          phone: parseInt(phone.value),
          password: password.value,
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
        axios(config)
          .then(function (response) {
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
            // }
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
      }
    }
    else { reactToUpdates() }
  };

  useEffect(() => {
    setShowModal(false)
    reactToUpdates();
    setShow(false);
    InternetCheck();
    setPhone({ value: "" });
    setPassword({ value: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <ToastProvider>
        <Center>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
            bg: "coolGray.800"
          }}>
            <Modal.Content maxWidth="90%" height={"300"} maxH="300">
              <Modal.Header>Шинэ хувилбар</Modal.Header>
              <Modal.Body>
                Shoe Gallery Wallet апп-д шинэ хувилбар гарсан байна.
                Илүү олон, Илүү шинэ боломжууд бий болсон байна. Хэрэглэгч та заавал аппаа шинэчилж ашиглана уу.
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button onPress={() => {
                    if (Platform.OS === "android") {
                      Linking.openURL("https://play.google.com/store/apps/details?id=com.shoegallery.sg_wallet_app")
                    }
                  }}>
                    Апп шинэчлэх
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Center>
        <VStack>
          <Background>
            <Logo
              style={{
                width: wp("25%"),
                heigth: wp("25%"),
                justifyContent: "center",
                alignItems: "center",
              }}
            />
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
                onChangeText={(number) =>
                  setPhone({ value: number, error: "" })
                }
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
                }
                placeholder="Нууц үг"
                label="Нууц үг"
                returnKeyType="done"
                textContentType="password"
                keyboardType="default"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: "" })}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.forgotPassword}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ForgetPasswordScreen")
                      }
                    >
                      <Text style={styles.forgot}>Нууц үгээ мартсан уу?</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
              <View style={{ marginVertical: 0 }}>
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
