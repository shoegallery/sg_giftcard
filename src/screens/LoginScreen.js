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

// import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
} from "native-base";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [userData, setUserData] = useContext(StateContext);
  const [internetCheck, setInternetCheck] = useState(false);

  console.log(internetCheck);
  NetInfo.fetch().then((networkState) => {
    setInternetCheck(networkState.isConnected);
  });

  const onLoginPressed = () => {
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);

    if (phoneError || passwordError) {
      setPhone({ ...phone, error: phoneError });
      setPassword({ ...password, error: passwordError });
      return;
    }

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
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
        // }
      })
      .catch(function (error) {
        setPassword({
          ...password,
          error: "Утасны дугаар эсвэл нууц үг буруу байна",
        });
      });
  };

  useEffect(() => {
    setInternetCheck(false);
    setPassword({ value: "", error: "" });
    setPhone({ value: "", error: "" });
  }, []);

  return (
    <NativeBaseProvider>
      <VStack>
        {internetCheck ? (
          <View></View>
        ) : (
          <Box h="32" w="300">
            <Slide in={internetCheck} placement="top">
              <Alert justifyContent="center" status="error">
                <Alert.Icon />
                <Text color="error.600" fontWeight="medium">
                  No Internet Connection
                </Text>
              </Alert>
            </Slide>
          </Box>
        )}
        <Background>
          <Logo style={{ width: wp("25%"), heigth: wp("25%") }} />
          <SafeAreaView style={{ width: "100%", height: hp("50%") }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  label="Утасны дугаар"
                  returnKeyType="next"
                  value={phone.value}
                  onChangeText={(number) =>
                    setPhone({ value: number, error: "" })
                  }
                  error={!!phone.error}
                  errorText={phone.error}
                  textContentType="telephoneNumber"
                  keyboardType="number-pad"
                />
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  label="Нууц үг"
                  returnKeyType="next"
                  value={password.value}
                  onChangeText={(text) =>
                    setPassword({ value: text, error: "" })
                  }
                  error={!!password.error}
                  errorText={password.error}
                  textContentType="password"
                  secureTextEntry
                  keyboardType="default"
                />
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.forgotPassword}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgetPasswordScreen")}
                  >
                    <Text style={styles.forgot}>Нууц үгээ мартсан уу?</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <View style={{ marginVertical: 0 }}>
              <Button
                backgroundColor="#03a9f4"
                shadow={2}
                size="md"
                mode="contained"
                onPress={onLoginPressed}
              >
                <Text fontSize="xl" bold color="white">
                  Нэвтрэх
                </Text>
              </Button>
            </View>

            <Button
              marginTop={hp("2%")}
              bordered
              margin="0"
              variant="Subtle"
              borderColor="#03a9f4"
              borderWidth="2"
              size="md"
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text fontSize="xl" bold color="#03a9f4">
                Шинээр бүртгүүлэх
              </Text>
            </Button>
          </SafeAreaView>
        </Background>
      </VStack>
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
    paddingTop: 2,
    fontSize: 13,
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
