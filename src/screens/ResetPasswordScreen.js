import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";

import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { tokenCodeValidator } from "../helpers/tokenCodeValidator";
import { passwordConfirmValidator } from "../helpers/passwordConfirmValidator";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, VStack, Text, NativeBaseProvider } from "native-base";
export default function ResetPasswordScreen({ navigation }) {
  const [tokenCode, setTokenCode] = useState({ value: null, error: "" });
  const [phone, setPhone] = useState({ value: null, error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });
  const onSignUpPressed = () => {
    const tokenCodeError = tokenCodeValidator(tokenCode.value);
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordConfirmValidator(
      passwordConfirm.value
    );

    if (phoneError || passwordError || tokenCodeError || passwordConfirmError) {
      setTokenCode({ ...tokenCode, error: tokenCodeError });
      setPhone({ ...phone, error: phoneError });
      setPassword({ ...password, error: passwordError });
      setPasswordConfirm({ ...passwordConfirm, error: passwordConfirmError });
      return;
    }
    if (password.value !== passwordConfirm.value) {
      setPasswordConfirm({
        ...passwordConfirm,
        error: "Баталгаажуулах нууц үг ижил байх ёстой.",
      });
      return;
    }

    console.log(request);
    var request = JSON.stringify({
      resetToken: parseInt(tokenCode.value),
      phone: parseInt(phone.value),
      password: password.value,
    });
    console.log(request);
    var config = {
      method: "POST",
      url: `${baseUrl}/wallets/reset-password`,
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
            routes: [{ name: "LoginScreen" }],
          });
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        if (err.status == 403) {
          setTokenCode({
            ...requestPhone,
            error: "Сэргээх код хүчингүй байна",
          });
        }
      });
  };

  return (
    <Background>
      <SafeAreaView style={{ width: wp("80%"), height: hp("60%") }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          enabled={false}
        >
          <TouchableOpacity>
            <TextInput
              label="Баталгаажуулах код"
              returnKeyType="next"
              value={tokenCode.value}
              onChangeText={(numbers) =>
                setTokenCode({ value: numbers, error: "" })
              }
              error={!!tokenCode.error}
              errorText={tokenCode.error}
              textContentType="telephoneNumber"
              keyboardType="number-pad"
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
          </TouchableOpacity>

          <Button
            style={{ marginTop: 20 }}
            backgroundColor="#0D7377"
            shadow={2}
            size="md"
            mode="contained"
            onPress={onSignUpPressed}
          >
            <Text fontSize="xl" bold color="white">
              Нууц үг сэргээх
            </Text>
          </Button>

          <View style={styles.row}></View>
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
