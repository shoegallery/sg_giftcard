import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import TextInput from "../components/TextInput";

import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { tokenCodeValidator } from "../helpers/tokenCodeValidator";
import { passwordConfirmValidator } from "../helpers/passwordConfirmValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Alert } from "react-native";

import {
  WarningOutlineIcon,
  Button,
  Modal,
  Text,
  FormControl,
  Input,
} from "native-base";

export default function ForgetPasswordScreen({ navigation }) {
  const [requestPhone, setRequestPhone] = useState({ value: "", error: "" });
  const [showModal, setShowModal] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [tokenCode, setTokenCode] = useState({ value: null, error: "" });
  const [phone, setPhone] = useState({ value: null, error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: "",
    error: "",
  });

  const sendChangePassword = () => {
    setShowModal(false);
    const tokenCodeError = tokenCodeValidator(tokenCode.value);
    const phoneError = phoneValidator(requestPhone.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordConfirmValidator(
      passwordConfirm.value
    );

    if (phoneError || passwordError || tokenCodeError || passwordConfirmError) {
      setTokenCode({ ...tokenCode, error: tokenCodeError });
      setPhone({ ...requestPhone, error: phoneError });
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

    var request = JSON.stringify({
      resetToken: parseInt(tokenCode.value),
      phone: parseInt(requestPhone.value),
      password: password.value,
    });

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
          Alert.alert("", "Нууц үг амжилттай солигдлоо", [
            {
              text: "OK",
            },
          ]);

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
          setShowReset(true);
          setShowModal(true);
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
    } catch (err) {}
  };
  useEffect(() => {
    sendResetPasswordMessage();
    setShowReset(false);
    setShowModal(false);
    setRequestPhone({ value: "", error: "" });
  }, []);
  return (
    <Background>
      <BackButton goBack={navigation.goBack} style={{ color: "red" }} />

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
            Баталгаажуулах код авах
          </Text>
        </Button>
        {showModal ? (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content width={"90%"} height={"60%"}>
              <Modal.CloseButton />
              <Modal.Header>
                <Text fontWeight="bold" color="gray.700" fontSize={20}>
                  Нууц үг шинээр үүсгэх
                </Text>
              </Modal.Header>
              <Modal.Body>
                <FormControl pt={5}>
                  <Input
                    borderWidth={2}
                    borderColor="gray.300"
                    placeholder="Утасны дугаар"
                    fontSize={20}
                    onChangeText={(values) =>
                      setPhone({ value: values, error: "" })
                    }
                    label="Утасны дугаар"
                    returnKeyType="next"
                    value={phone.value}
                    keyboardType="number-pad"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Try different from previous passwords.
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl pt={5}>
                  <Input
                    borderWidth={2}
                    borderColor="gray.300"
                    placeholder="Баталгаажуулах код"
                    fontSize={20}
                    returnKeyType="next"
                    value={tokenCode.value}
                    onChangeText={(numbers) =>
                      setTokenCode({ value: numbers, error: "" })
                    }
                    textContentType="oneTimeCode"
                    keyboardType="number-pad"
                  />
                </FormControl>
                <FormControl pt={5}>
                  <Input
                    borderWidth={2}
                    borderColor="gray.300"
                    placeholder="Шинэ нууц үг"
                    fontSize={20}
                    returnKeyType="next"
                    value={password.value}
                    onChangeText={(text) =>
                      setPassword({ value: text, error: "" })
                    }
                    textContentType="password"
                    secureTextEntry
                    keyboardType="default"
                  />
                </FormControl>
                <FormControl pt={5}>
                  <Input
                    borderWidth={2}
                    borderColor="gray.300"
                    placeholder="Шинэ нууц үг давтах"
                    fontSize={20}
                    returnKeyType="done"
                    value={passwordConfirm.value}
                    onChangeText={(textConfirm) =>
                      setPasswordConfirm({ value: textConfirm, error: "" })
                    }
                    textContentType="newPassword"
                    secureTextEntry
                    keyboardType="default"
                  />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={sendChangePassword}>Болсон</Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        ) : (
          <View></View>
        )}
        <View>
          {showReset ? (
            <Button
              style={{ marginTop: 30 }}
              size="md"
              backgroundColor="white"
              borderColor="#0D7377"
              borderWidth="2"
              onPress={() => {
                setShowModal(true);
              }}
            >
              <Text fontSize="xl" bold color="#0D7377">
                Нууц үг сэргээх
              </Text>
            </Button>
          ) : (
            <View></View>
          )}
        </View>
      </SafeAreaView>
    </Background>
  );
}
