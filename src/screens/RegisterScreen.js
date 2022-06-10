import { baseUrl } from "../baseUrl";
import axios from "axios";
import BackButton from "../components/BackButton";

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Background from "../components/Background";

import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button, Text, Input, Icon, useToast } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [show, setShow] = useState(false);
  const warnToastPassword = useToast();
  const warnToast = useToast();
  const [name, setName] = useState({ value: "" });
  const [phone, setPhone] = useState({ value: null });
  const [password, setPassword] = useState({ value: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });
  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordValidator(passwordConfirm.value);

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
    }
    if (nameError) {
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
        title: nameError,
        placement: "top",
      });
    }
    if (passwordConfirmError) {
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
        title: passwordConfirmError,
        placement: "top",
      });
    }

    if (password.value !== passwordConfirm.value) {
      warnToastPassword.show({
        backgroundColor: "red.400",
        px: "2",
        py: "1",
        rounded: "sm",
        height: "60",
        width: "250",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        title: "Баталжуулах нууц үг ижил байх ёстой",
        placement: "top",
      });
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
          warnToast.show({
            backgroundColor: "emerald.600",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Амжилттай бүртгүүллээ",
            placement: "top",
          });
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
      .catch(function (error) { });
  };
  useEffect(() => {
    setShow(false);
    setName({ value: "" });
    setPhone({ value: "" });
    setPassword({ value: "" });
    setPasswordConfirm({ value: "" });
  }, []);
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header>Бүртгэл үүсгэх</Header>
      <SafeAreaView style={{ width: wp("80%"), paddingTop: hp("1%"), height: hp("75%") }}>
        <Input
          returnKeyType="next"
          w={{
            base: "100%",
            md: "25%",
          }}
          h={16}
          fontSize={24}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="person" />}
              size={8}
              ml="2"
              color="muted.400"
            />
          }
          placeholder="Нэр"
          value={name.value}
          onChangeText={(text) => setName({ value: text })}
        />
        <Input
          returnKeyType="next"
          mt={"5%"}
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
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          value={phone.value}
          onChangeText={(number) => setPhone({ value: number })}
        />
        <Input
          returnKeyType="next"
          mt={"5%"}
          w={{
            base: "100%",
            md: "25%",
          }}
          h={16}
          fontSize={24}
          value={password.value}
          type={show ? "text" : "password"}
          placeholder="Нууц үг"
          onChangeText={(text) => setPassword({ value: text })}
          textContentType="password"
          keyboardType="default"
        />
        <Input
          returnKeyType="done"
          fontSize={24}
          mt={"5%"}
          w={{
            base: "100%",
            md: "25%",
          }}
          h={16}
          value={passwordConfirm.value}
          type={show ? "text" : "password"}
          InputRightElement={
            <Icon
              as={
                <MaterialIcons name={show ? "visibility" : "visibility-off"} />
              }
              size={8}
              mr="2"
              color="muted.400"
              onPress={() => setShow(!show)}
            />
          }
          placeholder="Нууц үг давтах"
          onChangeText={(textConfirm) =>
            setPasswordConfirm({ value: textConfirm })
          }
          textContentType="newPassword"
          keyboardType="default"
        />

        <Button
          colorScheme="blue"
          shadow="5"
          size="md"
          mt={"5%"}
          onPress={onSignUpPressed}
          bg="#1B98F5"
          mode="contained"
        >
          <Text fontSize="xl" bold color="white">
            Болсон
          </Text>
        </Button>
        <View style={styles.row}>
          <Text>Та бүртгэлтэй юу? </Text>
          <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
            <Text style={styles.link}>Тийм</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 1,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
