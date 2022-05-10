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
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };
  console.log(phone);

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Бүртгэл үүсгэх</Header>
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
                  onChangeText={(text) =>
                    setPasswordConfirm({ value: text, error: "" })
                  }
                  error={!!password.error}
                  errorText={password.error}
                  textContentType="newPassword"
                  secureTextEntry
                  keyboardType="default"
                />
              </TouchableWithoutFeedback>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={onSignUpPressed}
              style={{ marginTop: 24 }}
            >
              Sign Up
            </Button>

            <View style={styles.row}>
              <Text>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.replace("LoginScreen")}
              >
                <Text style={styles.link}>Login</Text>
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
    marginTop: 3,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
