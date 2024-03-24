import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useEffect, useState, useContext } from "react";
import { View, Dimensions, Platform, UIManager } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

import * as Haptics from "expo-haptics";
import { NumericFormat } from "react-number-format";


import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StateContext, StateContextHistory } from "../Context/StateContext";
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
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const PurchaseScreen = ({ navigation, route }) => {



  const [userData, setUserData] = useContext(StateContext);
  const [canGoBack, setCanGoBack] = useState(false)

  const [onOpen, setOnOpen] = useState(false);
  const [service, setService] = useState("");
  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });

  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  const dataRefresher = () => {
    InternetCheck();
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
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Уучлаарай",
            textBody: "Дараа дахин оролдоно уу",
            button: "Okey",
            onPressButton: () => {
              Dialog.hide();
            },
          });
        });
    } catch (err) {
      {
      }
    }
  };
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
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);

    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Амжилтгүй",
        textBody: "Дахин оролдоно уу. Ямар нэгэн зүйл буруу байна.",
        button: "Okey",

        onPressButton: () => {
          Dialog.hide();
        },
      });
      console.log(receiverPhone)
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
          dataRefresher();
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
        const err = JSON.parse(JSON.stringify(error));
        console.log(err);
        setReceiverAmount({ value: "", error: "" });
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
  const userTransactionHistory = () => {
    InternetCheck();
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
  useEffect(() => {
    setReceiverPhone({ value: route.params.data })
    InternetCheck();
    dataRefresher();
    userTransactionHistory();
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      title: "Үнийн дүнгээ оруулна уу",
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
    const listenerUnsubscribe = navigation.addListener('focus', () => {
      setCanGoBack(navigation.canGoBack())
    })
    return () => listenerUnsubscribe()
  }, [navigation]);
  return (
    <View style={{ justifyContent: "center", alignContent: "center" }}>
      <View style={{ height: hp("60%") - 50, backgroundColor: "#ececec" }}>
        <Box height={"100%"}>
          <Center>
            <Box justifyItems={"right"}>
              <NumericFormat
                width="95%"
                value={userData.wallets.balance.$numberDecimal}
                displayType={"text"}
                thousandSeparator={true}
                renderText={(formattedValue) => (
                  <Text
                    paddingTop={5}
                    maxWidth={"90%"}
                    color="#424242"
                    fontSize="md"
                  >
                    Боломжит үлдэгдэл: {formattedValue}₮
                  </Text>
                )}
              />
            </Box>
            <Box marginLeft={1 / 2} margin={1} justifyContent="center">
              <Text
                fontWeight={"semibold"}
                alignSelf={"flex-start"}
                marginTop={1}
                fontSize={"md"}
              >
                Дүн
              </Text>
            </Box>
            <HStack height="16" width="xs" justifyContent="center">
              <Box
                borderRadius="sm"
                margin={1}
                marginLeft={1 / 2}
                width="95%"
                justifyContent="center"
                backgroundColor="#ececec"
                shadow={"4"}
              >
                <Center>
                  <VStack>
                    {receiverAmount.value === "" ? (
                      <Text fontSize="3xl" fontFamily="bold" color="#325b77">
                        0₮
                      </Text>
                    ) : (
                      <NumericFormat
                        value={receiverAmount.value}
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
              paddingTop={2}
              borderWidth={0}
              borderColor={"white"}
              width={"xs"}
              height={"24"}
              alignSelf="center"
              justifyContent="center"
              marginTop={5}
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
                      fontSize="2xl"
                    >
                      Төлөх
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "1",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "2",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "3",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "4",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "5",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "6",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "7",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "8",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "9",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => { }}
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (receiverAmount.value.length < 8) {
                        setReceiverAmount({
                          value: receiverAmount.value + "0",
                        });
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
                  backgroundColor="#ececec"
                >
                  <TouchableHighlight
                    underlayColor="#f8f8f8"
                    onPress={() => {
                      if (
                        receiverAmount.value.length < 9 &&
                        receiverAmount.value.length > 0
                      ) {
                        setReceiverAmount({
                          value: receiverAmount.value.substr(
                            0,
                            receiverAmount.value.length - 1
                          ),
                        });
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

export default PurchaseScreen;
