import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";

import { phoneValidator } from "../helpers/phoneValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { tokenCodeValidator } from "../helpers/tokenCodeValidator";
import { passwordConfirmValidator } from "../helpers/passwordConfirmValidator";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View } from "react-native";

import {
  Button,
  Modal,
  Text,
  FormControl,
  Input,
  Icon,
  useToast,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
export default function ForgetPasswordScreen({ navigation }) {
  const [show, setShow] = useState(false);
  const warnToastPassword = useToast();
  const warnToast = useToast();
  const [requestPhone, setRequestPhone] = useState({ value: "" });
  const [showModal, setShowModal] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [tokenCode, setTokenCode] = useState({ value: null });
  const [phone, setPhone] = useState({ value: null });
  const [password, setPassword] = useState({ value: "" });
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

    if (tokenCodeError) {
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
        title: tokenCodeError,
        placement: "top",
      });
    }
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
        title: passwordError,
        placement: "top",
      });
    }
    if (passwordConfirmError) {
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
        title: passwordConfirmError,
        placement: "top",
      });
    }

    if (password.value !== passwordConfirm.value) {
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
        title: "Нууц үг ижил байх ёстой.",
        placement: "top",
      });
    }
    if (password.value === passwordConfirm.value) {
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
              title: "Нууц үг амжилттай солигдлоо",
              placement: "top",
            });

            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          }
        })
        .catch(function (error) {
          const err = JSON.parse(JSON.stringify(error));
          if (err.status == 403) {
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
              title: "Сэргээх код хүчингүй байна",
              placement: "top",
            });
          }
        });
    }
  };

  const sendResetPasswordMessage = () => {
    const phoneError = phoneValidator(requestPhone.value);
    if (!phoneError) {
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
            title: "Мессеж илгээсэн.",
            placement: "top",
          });
          setShowReset(true);
          setShowModal(true);
        })
        .catch(function (error) {
          const err = JSON.parse(JSON.stringify(error));
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
            title: "хэрэглэгч олдсонгүй!",
            placement: "top",
          });
        });
    } catch (err) {}
  };
  useEffect(() => {
    setShowReset(true);
    setShowModal(false);
    setRequestPhone({ value: "" });
  }, []);
  return (
    <Background>
      <BackButton goBack={navigation.goBack} style={{ color: "red" }} />

      <SafeAreaView style={{ width: wp("80%"), height: hp("75%") }}>
        <Input
          returnKeyType="next"
          w={{
            base: "100%",
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
          value={requestPhone.value}
          onChangeText={(number) => setRequestPhone({ value: number })}
          description="Таны гар утсанд баталгаажуулах код илгээнэ."
        />

        <Button
          colorScheme="blue"
          mt={"10%"}
          bg="#1B98F5"
          shadow="5"
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
            <Modal.Content width={"90%"} height={"90%"}>
              <Modal.CloseButton />
              <Modal.Header>
                <Text fontWeight="bold" color="gray.700" fontSize={20}>
                  Нууц үг шинээр үүсгэх
                </Text>
              </Modal.Header>
              <Modal.Body>
                <FormControl>
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
                </FormControl>
                <FormControl pt={3}>
                  <Input
                    returnKeyType="next"
                    w={{
                      base: "100%",
                      md: "25%",
                    }}
                    h={16}
                    fontSize={24}
                    placeholder="Баталгаажуулах код"
                    textContentType="oneTimeCode"
                    keyboardType="number-pad"
                    value={tokenCode.value}
                    onChangeText={(numbers) => setTokenCode({ value: numbers })}
                  />
                </FormControl>
                <FormControl pt={3}>
                  <Input
                    returnKeyType="next"
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
                </FormControl>
                <FormControl pt={3}>
                  <Input
                    returnKeyType="done"
                    fontSize={24}
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
                          <MaterialIcons
                            name={show ? "visibility" : "visibility-off"}
                          />
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
              shadow="5"
              size="md"
              style={{ marginTop: 10 }}
              bg="white"
              borderColor="#1B98F5"
              borderWidth="2"
              onPress={() => {
                setShowModal(true);
              }}
            >
              <Text fontSize="xl" bold color="#1B98F5">
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
