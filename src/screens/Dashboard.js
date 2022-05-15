import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet, Alert, RefreshControl } from "react-native";
import Background from "../components/Background";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

import NumberFormat from "react-number-format";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { StateContext } from "../Context/StateContext";

import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BarCodeScanner } from "expo-barcode-scanner";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useContext(StateContext);
  const [showModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const checkOut = () => {
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);
    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      return;
    }

    var request = JSON.stringify({
      fromPhone: userData.wallets.phone,
      toPhone: parseInt(receiverPhone.value),
      amount: parseInt(receiverAmount.value),
      summary: `Худалдан авалтын гүйлгээ`,
      id: userData.wallets._id,
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/purchase`,
      headers: {
        "Content-Type": "application/json",
        Cookie: `Bearer=${userData.token}`,
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReceiverPhone({ value: "", error: "" });
          setReceiverAmount({ value: "", error: "" });
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
          Alert.alert("Гүйлгээ 0", "Танысс ", [
            {
              text: "OK",
            },
          ]);
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
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
    console.log("first");
    try {
      var requests = JSON.stringify({
        phone: userData.wallets.phone,
      });

      var configs = {
        method: "POST",
        url: `${baseUrl}/wallets/my/${userData.wallets._id}`,
        headers: {
          "Content-Type": "application/json",
          Cookie: `Bearer=${userData.token}`,
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
    } catch (err) {
      console;
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setReceiverPhone({ value: data, error: "" });
    setScanned(true);
    alert(`Амжилттай уншигдлаа. ok дээр дарна уу`);
    setCameraOpen(false);
  };

  var imageSource;
  if (userData.wallets.walletType === "member") {
    imageSource = require("../assets/cardTypes/member.png");
  } else if (userData.wallets.walletType === "rosegold") {
    imageSource = require("../assets/cardTypes/rosegold.png");
  } else if (userData.wallets.walletType === "golden") {
    imageSource = require("../assets/cardTypes/golden.png");
  } else if (userData.wallets.walletType === "platnium") {
    imageSource = require("../assets/cardTypes/platnium.png");
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    setShowModal(false);
    setCameraOpen(false);
    setScanned(false);
    checkOut();
    setHasPermission(null);
    setReceiverPhone({ value: "", error: "" });
    setReceiverAmount({
      value: "",
      error: "",
    });
  }, []);
  if (hasPermission === false && cameraOpen === false && showModal === false) {
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
          <View>
            <Image
              source={imageSource}
              style={{
                alignSelf: "center",
                position: "relative",
                maxHeight: hp("35%"),
                width: wp("95%"),
                resizeMode: "contain",
              }}
            />
            <View
              style={{
                position: "absolute",
                marginTop: hp("20%"),
                marginLeft: wp("10%"),

                padding: 1,
              }}
            >
              <NumberFormat
                value={userData.wallets.balance.$numberDecimal}
                displayType={"text"}
                thousandSeparator={true}
                renderText={(formattedValue) => (
                  <View>
                    <Text color="white" fontSize="xl">
                      Хэтэвчинд
                    </Text>
                    <Text bold paddingTop={0} color="white" fontSize="2xl">
                      {formattedValue}₮
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: hp("45%"),
              width: wp("95%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: wp("95%"),
                position: "relative",
                height: hp("6%"),
              }}
            >
              <Button
                variant="subtle"
                borderWidth={3}
                backgroundColor="#EEE4AB"
                borderColor="#ECB390"
                borderRadius={10}
                height={16}
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
                        {scanned && (
                          <Button
                            height={hp("8%")}
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
                height={16}
                flex={1}
                bordered
                success
              >
                <Text bold fontSize="lg" color="#898B8A">
                  Цэнэглэлт
                </Text>
              </Button>
            </View>

            <View style={{ paddingTop: 100 }}>
              <Header style={{}}>Let’s start</Header>
              <Paragraph style={{ position: "relative" }}>
                Your amazing app starts here. Open you favorite code editor and
                start editing this project.
              </Paragraph>
              <View style={{ justifyContent: "flex-end" }}>
                <Button
                  backgroundColor="#7986CB"
                  shadow={2}
                  size="md"
                  mode="contained"
                  onPress={() => dataRefresher()}
                >
                  <Text fontSize="xl" bold color="white">
                    Logout
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Background>
    </NativeBaseProvider>
  );
}
