import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import Background from "../components/Background";

import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  View,
  useToast,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BarCodeScanner } from "expo-barcode-scanner";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";

export default function Dashboard({ navigation }, props) {
  const successToast = useToast();
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  const [alartView, setAlartView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [receiverOrder, setReceiverOrder] = useState({ value: "", error: "" });
  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });

  const checkOut = () => {
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);

    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      Alert.alert(
        "Та шилжүүлгийн мэдээллээ зөв оруулна уу",
        `Утасны дугаар зөвхөн 8 орноос бүрдэх ёстой. Үнийн дүн зөвхөн тоо агуулна.`,
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    }

    var request = JSON.stringify({
      fromPhone: userData.wallets.phone,
      toPhone: parseInt(receiverPhone.value),
      amount: parseInt(receiverAmount.value),
      summary: `Худалдан авалтын гүйлгээ`,
      id: userData.wallets._id,
      walletSuperId: userData.wallets.walletSuperId,
      OrderNumber: parseInt(receiverOrder.value),
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/purchase`,
      headers: {
        "Content-Type": "application/json",
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReceiverPhone({ value: "", error: "" });
          setReceiverAmount({ value: "", error: "" });
          userTransactionHistory();
          setAlartView(false);
          dataRefresher();
          successToast.show({
            backgroundColor: "emerald.400",
            px: "2",
            py: "1",
            rounded: "sm",
            height: "50",
            width: "250",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            title: "Гүйлгээ амжилттай",
            placement: "top",
          });
        } else {
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
            title: "Гүйлгээ aмжилтгүй",
            placement: "top",
          });
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        setReceiverAmount({ value: "", error: "" });
        if (err.status == 405) {
          Alert.alert(
            "Хүлээн авах хэрэглэгч олдсонгүй",
            "Хүлээн авагч хэрэглэгчийн утасны дугаарыг шалгана уу",
            [
              {
                text: "OK",
              },
            ]
          );
        }
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
          title: "Гүйлгээ aмжилтгүй",
          placement: "top",
        });
      });
  };

  const dataRefresher = () => {
    try {
      var requests = JSON.stringify({
        walletSuperId: userData.wallets.walletSuperId,
      });

      var configs = {
        method: "POST",
        url: `${baseUrl}/wallets/my/${userData.wallets._id}`,
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 0,
        data: requests,
      };
      axios(configs)
        .then(function (response) {
          userTransactionHistory();
          setUserData({
            token: userData.token,
            wallets: response.data.wallets,
          });
        })
        .catch(function (error) {
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
            title: "Сервер түр унтарсан.",
            placement: "top",
          });
        });
    } catch (err) {
      {
      }
    }
  };

  const userTransactionHistory = () => {
    var datas = JSON.stringify({
      walletSuperId: userData.wallets.walletSuperId,
    });

    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/wallet/${userData.wallets._id}`,
      headers: {
        "Content-Type": "application/json",
      },

      data: datas,
    };

    axios(config)
      .then((response) => {
        setUserTransactionData(response.data.data);
      })
      .catch((error) => {
        {
        }
      });
  };
  const handleBarCodeScanned = ({ data }) => {
    setReceiverPhone({ value: data, error: "" });
    setScanned(true);
    setCameraOpen(false);
    Alert.alert("Амжилттай уншигдлаа", "OK дээр дарна уу", [
      {
        text: "OK",
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    setShowModal(false);
    setCameraOpen(false);
    setScanned(false);
    userTransactionHistory();
    setUserTransactionData("");
    setHasPermission(null);
    setReceiverPhone({ value: "", error: "" });
    setReceiverAmount({
      value: "",
      error: "",
    });
  }, []);
  if (
    hasPermission === false &&
    cameraOpen === false &&
    showModal === false &&
    alartView === false
  ) {
    setAlartView(true);

    Alert.alert(
      "Санамж",
      "Та апп-д камер ашиглах зөвшөөрөл олгоогүй байна. Та худалдан авалт хийхдээ хүлээн авагчийн дугаарыг сайтар нягтална уу.",
      [
        {
          text: "OK",
        },
      ]
    );
  }

  return (
    <NativeBaseProvider>
      <Background>
        <View style={{ display: "flex" }}>
          <CartStyle />
          <View
            style={{
              paddingTop: hp("0.5%"),
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: hp("10%"),
              width: wp("95%"),
            }}
          >
            <VStack justifyContent="center" alignItems="center">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Button
                  variant="subtle"
                  borderWidth={3}
                  backgroundColor="#EEE4AB"
                  borderColor="#ECB390"
                  borderRadius={10}
                  height={"90%"}
                  marginRight={1}
                  flex={1}
                  bordered
                  success
                  onPress={() => {
                    setShowModal(true);
                    setCameraOpen(true);
                  }}
                >
                  <Text bold fontSize="lg" color="#4E3620">
                    Худалдан авалт
                  </Text>
                </Button>
                {showModal ? (
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content width={wp("80%")} height={hp("60%")}>
                      <Modal.CloseButton />
                      <Modal.Header>
                        <Text
                          bold
                          color="#242B2E"
                          fontSize={20}
                          textAlign="center"
                        >
                          Төлбөр төлөх
                        </Text>
                      </Modal.Header>
                      {cameraOpen === hasPermission ? (
                        <BarCodeScanner
                          onBarCodeScanned={
                            scanned ? undefined : handleBarCodeScanned
                          }
                          style={StyleSheet.absoluteFillObject}
                        >
                          <Button
                            onPress={() => {
                              setCameraOpen(false),
                                setHasPermission(false),
                                setShowModal(false);
                            }}
                          >
                            Камер хаах
                          </Button>
                          {scanned && (
                            <Button
                              height={"8%"}
                              onPress={() => {
                                setScanned(false);

                                setReceiverAmount({
                                  value: "",
                                  error: "",
                                });
                                setShowModal(true);
                                setCameraOpen(true);
                              }}
                            >
                              Дахин скан хийх
                            </Button>
                          )}
                        </BarCodeScanner>
                      ) : (
                        <View></View>
                      )}

                      <Modal.Body>
                        <FormControl>
                          <FormControl.Label>
                            <Text
                              fontSize={20}
                              fontWeight="semibold"
                              color="gray.700"
                            >
                              Хүлээн авагч
                            </Text>
                          </FormControl.Label>

                          {hasPermission === true ? (
                            <Box>
                              <Input
                                fontSize={20}
                                readonly="readonly"
                                value={String(receiverPhone.value)}
                              />
                            </Box>
                          ) : (
                            <View>
                              <Box>
                                <Input
                                  fontSize={20}
                                  returnKeyType="next"
                                  onChangeText={(receiverAmountPhone) =>
                                    setReceiverPhone({
                                      value: receiverAmountPhone,
                                      error: "",
                                    })
                                  }
                                  keyboardType="number-pad"
                                />
                              </Box>
                            </View>
                          )}
                        </FormControl>

                        <FormControl.Label>
                          <Text
                            fontSize={20}
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            Үнийн дүн
                          </Text>
                        </FormControl.Label>
                        <Box>
                          <Input
                            fontSize={20}
                            value={String(receiverAmount.value)}
                            returnKeyType="done"
                            onChangeText={(receiverAmountNumber) =>
                              setReceiverAmount({
                                value: receiverAmountNumber,
                                error: "",
                              })
                            }
                            keyboardType="number-pad"
                          />
                        </Box>

                        <FormControl.Label>
                          <Text
                            fontSize={20}
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            Гүйлгээний утга
                          </Text>
                        </FormControl.Label>
                        <Box>
                          <Input
                            fontSize={20}
                            value={String(receiverOrder.value)}
                            returnKeyType="done"
                            onChangeText={(receiverSummeryNumber) =>
                              setReceiverOrder({
                                value: receiverSummeryNumber,
                                error: "",
                              })
                            }
                            keyboardType="number-pad"
                          />
                        </Box>
                        <Text fontSize={12} bold color="red.700">
                          Худалдааны зөвлөх танд тайлбарлах болно
                        </Text>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button.Group space={5}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal(false);
                              setReceiverPhone({ value: "", error: "" });
                              setReceiverAmount({
                                value: "",
                                error: "",
                              });
                              setScanned(false);
                            }}
                          >
                            <Text bold color="#242B2E">
                              Хаах
                            </Text>
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal(false);
                              checkOut();
                              setScanned(false);
                            }}
                          >
                            <Text bold color="white">
                              Төлөх
                            </Text>
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                ) : (
                  <View></View>
                )}

                <Button
                  isDisabled
                  variant="subtle"
                  borderWidth={3}
                  backgroundColor="#EEEDDE"
                  borderColor="#898B8A"
                  borderRadius={10}
                  marginLeft={1}
                  height={"90%"}
                  flex={1}
                  bordered
                  success
                >
                  <Text bold fontSize="lg" color="#898B8A">
                    Цэнэглэлт
                  </Text>
                </Button>
              </View>
            </VStack>
            <View
              style={{
                width: "100%",

                position: "absolute",
                marginTop: hp("12%"),
              }}
              borderRadius="1"
              borderBottomWidth="2"
              borderBottomColor="gray.500"
            ></View>
            <View style={{ marginTop: hp("4%"), height: hp("3%") }}>
              <Heading
                textAlign="center"
                size="sm"
                color="#242B2E"
                bgColor="red"
              >
                ШИНЭ ЗАГВАРУУД
              </Heading>
            </View>

            <View
              style={{
                marginTop: hp("1%"),
                width: wp("95%"),
                height: hp("30%"),
              }}
            >
              <Product />
            </View>
            <View
              style={{
                width: wp("95%"),
                height: hp("18%"),
              }}
            >
              <MyActionButtonComponent navigation={navigation} />
            </View>
          </View>
        </View>
      </Background>
    </NativeBaseProvider>
  );
}
