import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import { phoneValidator } from "../helpers/phoneValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Button, VStack, Text, NativeBaseProvider } from "native-base";

export default function ForgetPasswordScreen({ navigation }) {
  const [requestPhone, setRequestPhone] = useState({ value: null, error: "" });

  const sendResetPasswordMessage = () => {
    const phoneError = phoneValidator(requestPhone.value);
    if (phoneError) {
      setRequestPhone({ ...requestPhone, error: phoneError });
      return;
    }

    var requestPassword = JSON.stringify({
      phone: parseInt(requestPhone.value),
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/wallets/forgot-password`,
      headers: {
        "Content-Type": "application/json",
      },

      data: requestPassword,
    };
    try {
      axios(config)
        .then(function (responseTokenCode) {
          // if (response.data.status === true) {
          // console.log(JSON.stringify(response.data));
          navigation.navigate("ResetPasswordScreen");

          // }
        })
        .catch(function (error) {
          const err = JSON.parse(JSON.stringify(error));

          if (err.status == 401) {
            setRequestPhone({
              ...requestPhone,
              error: "Хэрэглэгч олдсонгүй утасны дугаараа шалгана уу",
            });
          } else if (err.status == 402) {
            setRequestPhone({
              ...requestPhone,
              error: "3 хоногт 1 удаа нууц үг сэргээх боломжтой",
            });
          }
        });
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };
  useEffect(() => {
    setRequestPhone({ value: null, error: "" });
  }, []);
  return (
    <Background>
      <Header>Нууц үгээ сэргээх</Header>

      <BackButton goBack={navigation.goBack} />
      <SafeAreaView style={{ width: "100%" }}>
        <TextInput
          label="Утасны дугаар"
          returnKeyType="next"
          value={requestPhone.value}
          onChangeText={(number) =>
            setRequestPhone({ value: number, error: "" })
          }
          error={!!requestPhone.error}
          errorText={requestPhone.error}
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          description="Таны гар утсанд баталгаажуулах код илгээнэ."
        />

        <Button
          style={{ marginTop: 30 }}
          backgroundColor="#0D7377"
          shadow={2}
          size="md"
          mode="contained"
          onPress={sendResetPasswordMessage}
        >
          <Text fontSize="xl" bold color="white">
            Нууц үг сэргээх
          </Text>
        </Button>
      </SafeAreaView>
    </Background>
  );
}
