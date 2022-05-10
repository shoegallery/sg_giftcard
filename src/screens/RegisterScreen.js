import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
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
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });
  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = phoneValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  };

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
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
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
            />

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
            />

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
