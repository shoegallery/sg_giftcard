import { baseUrl } from "../baseUrl";
import React, { useState, useEffect, useContext } from "react";
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
import { StateContext } from "../Context/StateContext";
import { golden, platnium, rosegold, member } from "../assets/cardTypes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "88268360", error: "" });
  const [password, setPassword] = useState({ value: "88268360", error: "" });
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
        console.log(error);
        setPassword({
          ...password,
          error: "Утасны дугаар эсвэл нууц үг буруу байна",
        });
      });
  };
  useEffect(() => {}, []);
  return (
    <Background>
      <Logo style={{ width: wp("25%"), heigth: wp("25%") }} />
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
          onPress={() => navigation.navigate("ForgetPasswordScreen")}
        >
          <Text style={styles.forgot}>Нууц үгээ мартсан уу?</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 0, margin: 0 }}>
        <Button mode="contained" onPress={onLoginPressed}>
          Нэвтрэх
        </Button>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
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
