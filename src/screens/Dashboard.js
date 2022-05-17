import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import Background from "../components/Background";

import Paragraph from "../components/Paragraph";
import QRCode from "react-native-qrcode-svg";

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
  PresenceTransition,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BarCodeScanner } from "expo-barcode-scanner";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";

export default function Dashboard({ navigation }, props) {
  const [userData, setUserData] = useContext(StateContext);
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  const [alartView, setAlartView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
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
          Alert.alert(
            "Гүйлгээ амжилттай",
            `Таны худалдан авалтын төлбөр ${receiverAmount.value}₮ амжилттай төлөгдлөө`,
            [
              {
                text: "OK",
              },
            ]
          );
        } else {
          Alert.alert("", "Гүйлгээ амжилтгүй ", [
            {
              text: "OK",
            },
          ]);
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
        } else if (err.status == 406) {
          Alert.alert("Мэдэгдэл", "Таны хэтэвчний үлдэгдэл хүрэлцэхгүй байна", [
            {
              text: "OK",
            },
          ]);
        }
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
          setUserData({
            token: userData.token,
            wallets: response.data.wallets,
          });
        })
        .catch(function (error) {});
    } catch (err) {}
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
        const err = JSON.parse(JSON.stringify(error));
        // console.log(err);
        console.log(err);
      });
  };
  const handleBarCodeScanned = ({ data }) => {
    setReceiverPhone({ value: data, error: "" });
    setScanned(true);
    alert(`Амжилттай уншигдлаа. ok дээр дарна уу`);
    setCameraOpen(false);
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
                    <Modal.Content width={wp("80%")} height="60%">
                      <Modal.CloseButton />
                      <Modal.Header>
                        <Text fontWeight="bold" color="gray.700" fontSize={20}>
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
                      </Modal.Body>

                      <Modal.Footer>
                        <Button.Group space={2}>
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
                            Болих
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal(false);
                              checkOut();
                              setScanned(false);
                            }}
                          >
                            Төлөх
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
