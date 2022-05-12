import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { phoneValidator } from "../helpers/phoneValidator";
import { SafeAreaView } from "react-native-safe-area-context";

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
          console.log(error);
          setRequestPhone({
            ...requestPhone,
            error: "Утасны дугаар эсвэл нууц үг буруу байна",
          });
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
      <BackButton goBack={navigation.goBack} />
      <Header>Нууц үгээ сэргээх</Header>
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
          mode="contained"
          onPress={sendResetPasswordMessage}
          style={{ marginTop: 16 }}
        >
          Send Instructions
        </Button>
      </SafeAreaView>
    </Background>
  );
}
