import { baseUrl } from "../baseUrl";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "86218721", error: "" });
  const [password, setPassword] = useState({ value: "12345678", error: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState();

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
      data: request,
    };

    axios(config)
      .then(function (response) {
        if (response.data.status === true) {
          // console.log(JSON.stringify(response.data));

          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        }
      })
      .catch(function (error) {
        setPassword({
          ...password,
          error: "Утасны дугаараа эсвэл нууц үгээ дахин оруулна уу",
        });
      });
  };
  useEffect(() => {}, []);
  return (
    <Background>
      <Logo style={{ width: 200, heigth: 150 }} />
      <Header>Welcome back.</Header>
      <SafeAreaView style={{ width: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          enabled={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              label="Утасны дугаар"
              returnKeyType="next"
              value={phone.value}
              onChangeText={(number) => setPhone({ value: number, error: "" })}
              error={!!phone.error}
              errorText={phone.error}
              textContentType="telephoneNumber"
              keyboardType="number-pad"
            />
          </TouchableWithoutFeedback>
          <TextInput
            label="Нууц үг"
            returnKeyType="next"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            textContentType="password"
            secureTextEntry
            keyboardType="default"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Нууц үгээ мартсан уу?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Нэвтрэх
      </Button>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Шинээр бүртгүүлэх</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 1,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
