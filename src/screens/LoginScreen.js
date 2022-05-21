import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
} from "react-native";

import axios from "axios";
import Background from "../components/Background";
import Logo from "../components/Logo";

import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StateContext, StateContextHistory } from "../Context/StateContext";
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
  Box,
  Slide,
  Alert,
  useColorModeValue,
  useToast,
  Input,
  ToastProvider,
  Icon,
} from "native-base";

export default function LoginScreen({ navigation }) {
  const warnToastPassword = useToast();
  const warnToast = useToast();
  const [show, setShow] = useState(false);

  const [phone, setPhone] = useState({ value: "" });
  const [password, setPassword] = useState({ value: "" });

  const [userData, setUserData] = useContext(StateContext);
  const [internetCheck, setInternetCheck] = useState(false);

  NetInfo.fetch().then((networkState) => {
    setInternetCheck(networkState.isConnected);
  });

  const onLoginPressed = () => {
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);

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
  };

  useEffect(() => {
    setShow(false);
    setInternetCheck(false);
    setPhone({ value: "" });
    setPassword({ value: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <ToastProvider>
        <VStack>
          {internetCheck ? (
            <View></View>
          ) : (
            <Box h="32" w="300">
              <Slide in={internetCheck} placement="top">
                <Alert justifyContent="center" status="error">
                  <Alert.Icon />
                  <Text color="error.600" fontWeight="medium">
                    Интернет холболт алга.
                  </Text>
                </Alert>
              </Slide>
            </Box>
          )}
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
                width: "100%",
                height: hp("50%"),
                justifyContent: "center",
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
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 1,
  },
  forgot: {
    fontWeight: "bold",
    paddingTop: 4,
    fontSize: 14,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  modalText: {
    fontSize: 18,
    color: "#555",
    marginTop: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
