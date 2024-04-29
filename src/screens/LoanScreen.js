import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Dimensions,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

import * as Haptics from "expo-haptics";
import { NumericFormat } from "react-number-format";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  StateContext,
  StateContextHistory,
  StateContextLoan,
} from "../Context/StateContext";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";

import {
  VStack,
  Text,
  Select,
  useToast,
  Center,
  Box,
  HStack,
  CheckIcon,
  Slider,
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const LoanScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useContext(StateContext);
  const [canGoBack, setCanGoBack] = useState(false);
  const [onChangeValue, setOnChangeValue] = React.useState(2);

  const [receiverAmount, setReceiverAmount] = useState("");
  const numbers = [];
  const bodyData = [];
  for (let i = 1; i <= onChangeValue; i++) {
    numbers.push(i);
  }
  for (let i = 1; i <= onChangeValue; i++) {
    bodyData.push({
      index: i,
      amount:
        i !== onChangeValue
          ? parseInt(receiverAmount) -
            Math.floor(parseInt(receiverAmount) / onChangeValue) *
              (onChangeValue - 1)
          : parseInt(receiverAmount) -
            Math.floor(parseInt(receiverAmount) / onChangeValue) *
              (onChangeValue - 1),
      date: new Date(new Date().getTime() + i * 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      status: false,
    });
  }

  const [onOpen, setOnOpen] = useState(false);
  const [service, setService] = useState("");

  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  const [userLoanData, setUserLoanData] = useContext(StateContextLoan);
  console.log(userLoanData);
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Уучлаарай",
          textBody: "Интэрнет холболт алга байна. Шалгана уу.",
          button: "Okey",
          onPressButton: () => {
            Dialog.hide();
          },
        });
      }
    });
  };

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true);
      checkOut();

      setTimeout(() => {
        setIsPressed(false);
      }, 10000); // Set a timeout to enable button presses after a specific duration (e.g., 1 second)
    }
  };

  const checkOut = () => {
    InternetCheck();

    var request = JSON.stringify({
      toPhone: 70000003,
      phone: userData.wallets.phone,
      walletSuperId: userData.wallets.walletSuperId,
      body: bodyData,
      amount: parseInt(receiverAmount),
    });
    var config = {
      method: "POST",
      url: `${baseUrl}/wallets/loan`,
      headers: {
        "Content-Type": "application/json",
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        console.log("--------" + response.data.success);
        if (response.data.success === true) {
          setReceiverAmount("");

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Гүйлгээ амжилттай хийгдлээ",
            button: "Okey",
            onPressButton: () => {
              Dialog.hide();
              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            },
          });
        }
      })
      .catch(function (error) {
        const err = JSON.stringify(error);
        console.log(err);
        setReceiverAmount("");
        if (err.status == 405) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Амжилтгүй",
            textBody: "Дахин оролдоно уу. Ямар нэгэн зүйл буруу байна.",
            button: "Okey",
            onPressButton: () => {
              Dialog.hide();
              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            },
          });
        }
        if (err.status == 403) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Амжилтгүй",
            textBody: "Ямар нэгэн зүйл буруу байна. Шалгана уу!.",
            button: "Okey",
            onPressButton: () => {
              Dialog.hide();
              navigation.reset({
                index: 0,
                routes: [{ name: "TabbarScreen" }],
              });
            },
          });
        }
      });
  };

  useEffect(() => {
    InternetCheck();
    setReceiverAmount("");
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      title: "Хувааж төлөх цэс",
      headerLeft: () => (
        <BackButton
          style={{ backgroundColor: "white" }}
          goBack={navigation.goBack}
        />
      ),
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    const listenerUnsubscribe = navigation.addListener("focus", () => {
      setCanGoBack(navigation.canGoBack());
    });
    return () => listenerUnsubscribe();
  }, [navigation]);

  return (
    <View style={{ justifyContent: "center", alignContent: "center" }}>
      <View style={{ height: hp("60%") - 50, backgroundColor: "white" }}>
        <Box height={"100%"}>
          <Center>
            <Box justifyItems={"right"}></Box>
            <Box
              height={"10%"}
              marginLeft={1 / 2}
              margin={1}
              justifyContent="center"
            >
              <Text
                fontWeight={"semibold"}
                alignSelf={"flex-start"}
                marginTop={1}
                fontSize={"md"}
                color="#325b77"
              >
                Та хуваан төлөх дүнгээ оруулна уу
              </Text>
            </Box>
            <HStack height="16" width="xs" justifyContent="center">
              <Box
                borderRadius="sm"
                margin={1}
                marginLeft={1 / 2}
                width="95%"
                justifyContent="center"
                backgroundColor="white"
                shadow={"4"}
              >
                <Center>
                  <VStack>
                    {receiverAmount === "" ? (
                      <Text fontSize="3xl" fontFamily="bold" color="#325b77">
                        0₮
                      </Text>
                    ) : (
                      <NumericFormat
                        value={receiverAmount}
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(formattedValue) => (
                          <Text
                            fontSize="3xl"
                            fontFamily="bold"
                            color="#325b77"
                          >
                            {formattedValue}₮
                          </Text>
                        )}
                      />
                    )}
                  </VStack>
                </Center>
              </Box>
            </HStack>
            <Box
              height={"10%"}
              marginLeft={1 / 2}
              margin={1}
              justifyContent="center"
            >
              <Text
                fontWeight={"semibold"}
                alignSelf={"flex-start"}
                marginTop={1}
                fontSize={"md"}
                color="#325b77"
              >
                Давтамж сонгох - {onChangeValue} удаа
              </Text>
            </Box>
            <Box space={4} alignItems="center" w="75%" maxW="300">
              <Slider
                defaultValue={2}
                maxValue={6}
                minValue={2}
                colorScheme="cyan"
                onChange={(v) => {
                  setOnChangeValue(Math.floor(v));
                }}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
            </Box>

            <View style={{ height: hp("16%") }}>
              {receiverAmount > 0 ? (
                <ScrollView>
                  {numbers.map((number) => (
                    <View key={number} style={{ height: hp("4%") }}>
                      <Box width={wp("85%")}>
                        <HStack>
                          <Box width="70%">
                            {number !== onChangeValue ? (
                              <NumericFormat
                                value={Math.floor(
                                  parseInt(receiverAmount) / onChangeValue
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                                renderText={(formattedValue) => (
                                  <Text
                                    color={"#1D3C78"}
                                    bold
                                    textAlign="left"
                                    fontSize={16}
                                  >
                                    {number === 1
                                      ? "Эхний"
                                      : number === 2 ||
                                        number === 3 ||
                                        number === 5 ||
                                        number === 6 ||
                                        number === 7 ||
                                        number === 8 ||
                                        number === 10 ||
                                        number === 12
                                      ? `${number} дахь`
                                      : `${number} дэх`}{" "}
                                    төлөлт: {formattedValue}₮
                                  </Text>
                                )}
                              />
                            ) : (
                              <NumericFormat
                                value={
                                  parseInt(receiverAmount) -
                                  Math.floor(
                                    parseInt(receiverAmount) / onChangeValue
                                  ) *
                                    (onChangeValue - 1)
                                }
                                displayType={"text"}
                                thousandSeparator={true}
                                renderText={(formattedValue) => (
                                  <Text
                                    color={"#1D3C78"}
                                    bold
                                    textAlign="left"
                                    fontSize={16}
                                  >
                                    Сүүлийн төлөлт: {formattedValue}₮
                                  </Text>
                                )}
                              />
                            )}
                          </Box>
                          <Box
                            alignItems={"center"}
                            justifyItems={"center"}
                            width="30%"
                          >
                            <Text fontSize={16} fontWeight={"normal"}>
                              {new Date(
                                new Date().getTime() +
                                  number * 15 * 24 * 60 * 60 * 1000
                              )
                                .toISOString()
                                .slice(0, 10)}{" "}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Text></Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View></View>
              )}
            </View>
            <Box
              borderWidth={0}
              borderColor={"white"}
              width={"xs"}
              height={"24"}
              alignSelf="center"
              justifyContent="center"
            >
              <Center>
                <TouchableHighlight
                  onPress={handlePress}
                  disabled={isPressed}
                  underlayColor="#bad6e8"
                  style={{
                    borderRadius: 30,
                    height: hp("7%"),
                    width: wp("70%"),
                    backgroundColor: "#5499c7",
                  }}
                >
                  <Box height={"100%"} justifyContent={"center"}>
                    <Text
                      alignItems={"center"}
                      textAlign={"center"}
                      color="white"
                      fontSize="xl"
                      fontWeight={"semibold"}
                    >
                      Ok
                    </Text>
                  </Box>
                </TouchableHighlight>
              </Center>
            </Box>
          </Center>
        </Box>
      </View>
      <View style={{ height: hp("40%"), justifyContent: "flex-end" }}>
        <Center justifyContent="flex-end" alignSelf="center" width="100%">
          <VStack>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "1");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          1
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "2");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          2
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "3");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          3
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  minH={"16"}
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "4");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          4
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "5");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          5
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "6");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          6
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "7");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          7
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "8");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          8
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "9");
                      }
                    }}
                  >
                    <VStack>
                      <Center
                        justifyContent="center"
                        height="100%"
                        width="100%"
                      >
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          9
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
            <View style={{ height: hp("10%") }}>
              <HStack>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {}}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          .
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.length < 8) {
                        setReceiverAmount(receiverAmount + "0");
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Text
                          fontSize="3xl"
                          color="#2a4c63"
                          fontFamily="regular"
                        >
                          0
                        </Text>
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
                <Box
                  borderRadius={0}
                  justifyContent="center"
                  borderColor="#c5c5c5"
                  borderWidth={1 / 4}
                  width="1/3"
                  backgroundColor="white"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (
                        receiverAmount.length < 9 &&
                        receiverAmount.length > 0
                      ) {
                        setReceiverAmount(
                          receiverAmount.substr(0, receiverAmount.length - 1)
                        );
                      }
                    }}
                  >
                    <VStack justifyContent="center" height="100%" width="100%">
                      <Center>
                        <Ionicons name="caret-back" size={30} color="#2a4c63" />
                      </Center>
                    </VStack>
                  </TouchableHighlight>
                </Box>
              </HStack>
            </View>
          </VStack>
        </Center>
      </View>
    </View>
  );
};

export default LoanScreen;
