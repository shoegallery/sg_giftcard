import { baseUrl } from "../baseUrl";
import axios from "axios";
import BackButton from "../components/BackButton";

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
import Header from "../components/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function RegisterScreen({ navigation }) {
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
        } else {
          setPhone({
            ...phone,
            error: response.data.message,
          });
        }
      })
      .catch(function (error) {});
  };

  return (
    <Background style={{ paddingTop: 100 }}>
      <BackButton goBack={navigation.goBack} />
      <Header>Бүртгэл үүсгэх</Header>
      <SafeAreaView style={{ width: wp("80%") }}>
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          enableOnAndroid={true}
          extraHeight={200}
          extraScrollHeight={0}
        >
          <View>
            <TextInput
              label="Нэр"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
            />
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

            <Button mode="contained" onPress={onSignUpPressed}>
              Бүртгүүлэх
            </Button>
          </View>
          <View style={styles.row}>
            <Text>Та бүртгэлтэй юу? </Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
              <Text style={styles.link}>Тийм</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
