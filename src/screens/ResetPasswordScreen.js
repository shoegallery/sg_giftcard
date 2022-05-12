import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [phone, setPhone] = useState({ value: null, error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });
  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordValidator(passwordConfirm.value);

    if (phoneError || passwordError || nameError || passwordConfirmError) {
      setName({ ...name, error: nameError });
      setPhone({ ...phone, error: phoneError });
      setPassword({ ...password, error: passwordError });
      setPasswordConfirm({ ...passwordConfirm, error: passwordError });
      return;
    }
    if (password.value !== passwordConfirm.value) {
      setPasswordConfirm({
        ...passwordConfirm,
        error: "Баталгаажуулах нууц үг ижил байх ёстой.",
      });
      return;
    }

    var request = JSON.stringify({
      username: name.value,
      phone: parseInt(phone.value),
      password: password.value,
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/wallets/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          // console.log(JSON.stringify(response.data));
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Background>
      <Logo />
      {/* <Header>Бүртгэл үүсгэх</Header> */}
      <SafeAreaView style={{ width: "100%", height: "70%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          enabled={false}
        >
          <ScrollView style={{ width: "100%", height: "100%" }}>
            <TouchableOpacity>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  label="Нэр"
                  returnKeyType="next"
                  value={name.value}
                  onChangeText={(text) => setName({ value: text, error: "" })}
                  error={!!name.error}
                  errorText={name.error}
                />
              </TouchableWithoutFeedback>
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
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  label="Нууц үгээ давтана уу."
                  returnKeyType="done"
                  value={passwordConfirm.value}
                  onChangeText={(textConfirm) =>
                    setPasswordConfirm({ value: textConfirm, error: "" })
                  }
                  error={!!passwordConfirm.error}
                  errorText={passwordConfirm.error}
                  textContentType="newPassword"
                  secureTextEntry
                  keyboardType="default"
                />
              </TouchableWithoutFeedback>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={onSignUpPressed}
              style={{ marginTop: 10 }}
            >
              Бүртгүүлэх
            </Button>

            <View style={styles.row}>
              <Text>Та бүртгэлтэй юу? </Text>
              <TouchableOpacity
                onPress={() => navigation.replace("LoginScreen")}
              >
                <Text style={styles.link}>Тийм</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 0 },
  row: {
    flexDirection: "row",
    marginTop: 1,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
