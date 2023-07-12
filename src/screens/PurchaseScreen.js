import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useRef, useEffect, useState, useContext } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Platform,
  UIManager,
  Alert,
} from "react-native";

import * as Haptics from "expo-haptics";
import { NumericFormat } from "react-number-format";
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
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
  NativeBaseProvider,
  useToast,
  ToastProvider,
  Center,
  Box,
  HStack,
  Modal,
  Button,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const PurchaseScreen = ({ navigation }) => {
  const toast = useToast();

  const successToast = useToast();
  const warnToast = useToast();

  const [userData, setUserData] = useContext(StateContext);

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
  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
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
          title: "Интэрнет холболт алга",
          placement: "top",
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
      navigation.goBack();
      Alert.alert(
        "",
        `Та шилжүүлгийн мэдээллээ зөв оруулна уу. Салбар болон үнийн дүнг заавал агуулна.`,
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
          dataRefresher();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

          navigation.goBack();
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        console.log(err);
        setReceiverPhone({ value: "", error: "" });
        navigation.goBack();
        setReceiverAmount({ value: "", error: "" });
        if (err.status == 405) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert("", "Дахин оролдоно уу. Ямар нэгэн зүйл буруу байна.", [
            {
              text: "OK",
            },
          ]);
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
    InternetCheck();
    dataRefresher();
    userTransactionHistory();
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      title: "Худалдан авалтад зарцуулах",
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
                Салбар
              </Text>
            </Box>
            <HStack height="16" width="xs" justifyContent="center">
              <Box
                borderRadius="sm"
                height="16"
                margin={1}
                marginLeft={1 / 2}
                width="95%"
                justifyContent="center"
                backgroundColor="#ececec"
                shadow={"4"}
              >
                <Select
                  selectedValue={service}
                  onValueChange={(itemValue) => {
                    setService(itemValue),
                      setReceiverPhone({ value: itemValue });
                  }}
                  showSoftInputOnFocus={false}
                  fontSize="md"
                  height="16"
                  accessibilityLabel="Choose Service"
                  placeholder="Энд дарж салбарыг сонгоно уу"
                  _selectedItem={{
                    bg: "#5499c7",
                    borderRadius: 10,
                    width: "full",
                    endIcon: <CheckIcon color="red" size={5} />,
                  }}
                >
                  <Select.Item
                    label="Гранд Плаза - Shoe Gallery"
                    value="50001000"
                  />
                  <Select.Item
                    label="Хүннү Моол - Shoe Gallery"
                    value="50002000"
                  />
                  <Select.Item label="УБИД - BASCONI" value="50003000" />
                  <Select.Item label="УБИД - Sasha Fabiani" value="50004000" />
                  <Select.Item label="Максмоол - BASCONI" value="50005000" />
                  <Select.Item
                    label="Максмоол - Sasha Fabiani"
                    value="50006000"
                  />
                </Select>
              </Box>
            </HStack>
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
