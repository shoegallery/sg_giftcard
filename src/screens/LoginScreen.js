import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
// import Button from "../components/Button";
import TextInput from "../components/TextInput";

import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StateContext } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Button, VStack, Text, NativeBaseProvider } from "native-base";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "86218721", error: "" });
  const [password, setPassword] = useState({ value: "86218721", error: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState();
  const [userData, setUserData] = useContext(StateContext);

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
    console.log(config.url);
    console.log(config.data);

    axios(config)
      .then(function (response) {
        // if (response.data.status === true) {
        // console.log(JSON.stringify(response.data));
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
  useEffect(() => {}, []);

  return (
    <NativeBaseProvider>
      <VStack w="100%" space={4} px="2" mt="4">
        <Background>
          <Logo style={{ width: wp("25%"), heigth: wp("25%") }} />
          <Header>Welcome back.</Header>
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
                backgroundColor="#7986CB"
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
              borderColor="#7986CB"
              borderWidth="2"
              size="md"
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text fontSize="xl" bold color="#7986CB">
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
});
