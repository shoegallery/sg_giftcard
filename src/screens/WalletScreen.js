import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { NumericFormat } from "react-number-format";
import {
  Alert,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { LoadingDots } from "@mrakesh0608/react-native-loading-dots";

import { LinearGradient } from "expo-linear-gradient";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import * as Clipboard from "expo-clipboard";

import { StateContext, StateContextHistory } from "../Context/StateContext";
import ScanScreen from "./ScanScreen";

import {
  Text,
  Box,
  useToast,
  HStack,
  Pressable,
  Popover,
  Button,
  Center,
  Modal,
  VStack,
  FormControl,
  Input,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const WalletScreen = ({ navigation,props }) => {
  console.log(props)
  const [showModal, setShowModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const successToast = useToast();
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);

  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

  const [showCouponModal, setShowCouponModal] = useState(false);

  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });
  const [receiverCoupon, setReceiverCoupon] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("123456789");
  };

  const wait = (timeout) => {
    InternetCheck();
    userTransactionHistory();
    dataRefresher();
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const InternetCheck = () => {
    NetInfo.fetch().then((networkState) => {
      if (networkState.isConnected !== true) {
        toast.show({
          backgroundColor: "red.400",
          description: "Интэрнет холболт алга",
          placement: "top",
        });
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
        });
      }
    });
  };
  const checkOut = () => {
    InternetCheck();
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);

    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      Alert.alert(
        "Та шилжүүлгийн мэдээллээ зөв оруулна уу",
        `Салбарыг заавал сонгоно, үнийн дүнд зөвхөн тоо агуулна.`,
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
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        console.log(err);
        setReceiverAmount({ value: "", error: "" });

        setReceiverPhone({ value: "", error: "" });
        if (err.status == 405) {
          Alert.alert("Дахин оролдоно уу", "Ямар нэгэн зүйл буруу байна.", [
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
    } catch (err) {}
  };
  const getCoupon = () => {
    InternetCheck();
    if (receiverCoupon.length !== 5) {
      setReceiverCoupon("");
      Alert.alert("", `Таны оруулсан купон кодын тэмдэгтийн урт буруу байна`, [
        {
          text: "OK",
        },
      ]);
      return;
    }
    var request = JSON.stringify({
      coupon_code: receiverCoupon,
      walletSuperId: userData.wallets.walletSuperId,
    });

    var config = {
      method: "POST",
      url: `${baseUrl}/transactions/use_coupon`,
      headers: {
        "Content-Type": "application/json",
      },
      data: request,
    };
    axios(config)
      .then(function (response) {
        if (response.data.success === true) {
          setReceiverCoupon("");
          userTransactionHistory();
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
            title: "Купон код идэвхжсэн",
            placement: "top",
          });
        } else {
          setReceiverCoupon("");
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
            title: "Дахин оролдоно уу",
            placement: "top",
          });
        }
      })
      .catch(function (error) {
        const err = JSON.parse(JSON.stringify(error));
        if (err.status === 405) {
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
            title: "Ашигласан купон код",
            placement: "top",
          });

          setReceiverCoupon("");
        } else if (err.status === 403) {
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
            title: "Идэвхгүй купон код",
            placement: "top",
          });

          setReceiverCoupon("");
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
    setLoadingStatus(false);
    InternetCheck();
    userTransactionHistory();
    setUserTransactionData("");
    setReceiverCoupon("");
    setReceiverPhone({ value: "", error: "" });
    setReceiverAmount({
      value: "",
      error: "",
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        height: "60%",
        width: "100%",
        flex: 1,
      }}
    >
      <StatusBar translucent={false} backgroundColor="#f4d0e0" />

      <LinearGradient
        start={{ x: 0.0, y: 0.1 }}
        end={{ x: 0.7, y: 0.8 }}
        locations={[0.0, 0.1, 0.9]}
        colors={["#f4d0e0", "#f4d0e0", "#fffcdc"]}
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      ></LinearGradient>
      <ScrollView>
        <View
          style={{
            alignSelf: "center",

            width: "90%",
          }}
        >
          <Box paddingTop={"3"}>
            {userData.wallets.walletType === "member" ? (
              <Box justifyContent={"center"}>
                <Pressable
                  onPress={() => {}}
                  paddingTop={3}
                  alignItems={"center"}
                >
                  {({ isHovered, isPressed }) => {
                    return (
                      <Box
                        justifyContent={"center"}
                        shadow={"3"}
                        width={"100%"}
                        borderRadius={"10"}
                        height={"100"}
                        backgroundColor={"white"}
                        bg={
                          isPressed
                            ? "coolGray.200"
                            : isHovered
                            ? "coolGray.200"
                            : "coolGray.100"
                        }
                        style={{
                          transform: [
                            {
                              scale: isPressed ? 1.02 : 1,
                            },
                          ],
                        }}
                      >
                        <Box>
                          <Text
                            fontWeight={"semibold"}
                            pl={"1"}
                            fontSize={"xl"}
                          >
                            <Text fontSize={"xl"} fontWeight={"semibold"}>
                              Зэрэглэл : Үнэнч үйлчлүүлэгч 😎
                            </Text>
                          </Text>
                          <Text
                            fontWeight={"semibold"}
                            pl={"1"}
                            fontSize={"xl"}
                          >
                            Оноо ⭐️
                          </Text>
                        </Box>
                      </Box>
                    );
                  }}
                </Pressable>

                <Text paddingTop={"2"} fontSize={"lg"} fontWeight={"semibold"}>
                  Танд санал болгох үйлчилгээ
                </Text>
                <HStack paddingTop={"1"} height={180} width={"100%"}>
                  <Pressable disabled width={"1/3"}>
                    <Box
                      justifyContent={"center"}
                      alignItems={"center"}
                      bg={"white"}
                      p="2"
                      rounded="8"
                      shadow={2}
                      borderWidth="0"
                      borderColor="coolGray.300"
                    >
                      <VStack>
                        <Box alignSelf="center">
                          <MaterialCommunityIcons
                            name="check-decagram-outline"
                            size={36}
                            color="blue"
                          />
                        </Box>
                        <Box justifyContent="center">
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            fontSize="sm"
                            textAlign={"center"}
                          >
                            Цуглуулах
                          </Text>
                        </Box>
                        <Box paddingTop={"2"}>
                          <Text
                            textAlign={"center"}
                            color="#325b77"
                            fontSize={"xs"}
                          >
                            Худалдан авалт бүрийнхээ үнийн дүнгийн{" "}
                            <Text fontSize={"xs"} bold>
                              5%
                            </Text>{" "}
                            оноо цуглуулах
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </Pressable>
                  <Pressable
                    paddingLeft={2}
                    height={"100%"}
                    disabled
                    width={"1/3"}
                  >
                    <Box
                      justifyContent={"center"}
                      alignItems={"center"}
                      bg={"white"}
                      p="2"
                      rounded="8"
                      shadow={2}
                      borderWidth="0"
                      borderColor="coolGray.300"
                    >
                      <VStack>
                        <Box alignSelf="center">
                          <MaterialCommunityIcons
                            name="check-decagram-outline"
                            size={36}
                            color="blue"
                          />
                        </Box>
                        <Box justifyContent="center">
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            fontSize="sm"
                            textAlign={"center"}
                          >
                            Шуурхай
                          </Text>
                        </Box>
                        <Box paddingTop={"2"}>
                          <Text
                            textAlign={"center"}
                            color="#325b77"
                            fontSize={"xs"}
                          >
                            Хямдралын мэдээг цаг алдалгүй зөвхөн танд хүргэнэ.
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </Pressable>
                  <Pressable paddingLeft={2} disabled width={"1/3"}>
                    <Box
                      justifyContent={"center"}
                      alignItems={"center"}
                      bg={"white"}
                      pt={"2"}
                      pb={"2"}
                      rounded="8"
                      shadow={2}
                      borderWidth="0"
                      borderColor="coolGray.300"
                    >
                      <VStack>
                        <Box alignSelf="center">
                          <MaterialCommunityIcons
                            name="check-decagram-outline"
                            size={36}
                            color="blue"
                          />
                        </Box>
                        <Box justifyContent="center">
                          <Text
                            color="coolGray.800"
                            fontWeight="medium"
                            fontSize="sm"
                            textAlign={"center"}
                          >
                            Хадгалах
                          </Text>
                        </Box>
                        <Box paddingTop={"2"}>
                          <Text
                            textAlign={"center"}
                            color="#325b77"
                            fontSize={"xs"}
                          >
                            Таны таалагдсан загвар, хэмжээг 5 хоног хадгална.
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </Pressable>
                </HStack>
              </Box>
            ) : (
              <Text></Text>
            )}
          </Box>
        </View>
        <View
          style={{
            alignSelf: "center",

            width: "85%",
          }}
        >
          <Pressable
            paddingTop={"6"}
            alignItems={"center"}
            onPress={() => {
              navigation.navigate("ScanScreen");
            }}
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  maxWidth={"95%"}
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"50%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <MaterialCommunityIcons
                            name="arrow-right-box"
                            size={32}
                            color="red"
                          />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          fontSize="md"
                          alignSelf={"center"}
                        >
                          Зарцуулах
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"44%"} justifyContent="center">
                      <NumericFormat
                        value={userData.wallets.balance.$numberDecimal}
                        displayType={"text"}
                        thousandSeparator={true}
                        renderText={(formattedValue) => (
                          <Text
                            bold
                            textAlign="right"
                            color="#325b77"
                            fontSize={18}
                          >
                            {formattedValue}₮
                          </Text>
                        )}
                      />
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
          <Pressable
            paddingTop={3}
            alignItems={"center"}
            onPress={() => {
              setShowModal(true);
            }}
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"94%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <MaterialIcons
                            name="save-alt"
                            size={32}
                            color="green"
                          />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          alignSelf={"center"}
                          fontSize="md"
                        >
                          Цэнэглэх
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("GetCouponScreen");
            }}
            paddingTop={3}
            alignItems={"center"}
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"94%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <AntDesign name="star" size={32} color="orange" />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          alignSelf={"center"}
                          fontSize="md"
                        >
                          Купон идэвхжүүлэх
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
          <Pressable
            paddingTop={3}
            alignItems={"center"}
            onPress={() => {
              Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Тун удахгүй...",
                button: "Ойлголоо",
              });
            }}
            /* onPress={() => {
          navigation.navigate("TransferScreen");
        }}
        */
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"94%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <AntDesign name="gift" size={32} color="orange" />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          alignSelf={"center"}
                          fontSize="md"
                        >
                          Бэлэглэх
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
          {showModal === true ? (
            <Center>
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                _backdrop={{
                  _dark: {
                    bg: "coolGray.800",
                  },
                  bg: "coolGray.800",
                }}
              >
                <Modal.Content width={"80%"} maxH="412">
                  <Modal.Header>Цэнэглэх заавар</Modal.Header>
                  <Modal.Body>
                    Та доорх дансаар төлбөрөө төлж, Point Plus аппын дансаа
                    цэнэглээрэй.
                    <Box width={"100%"}>
                      <HStack>
                        <Text pt={3} fontSize={"md"} space={2}>
                          Хаанбанк:{" "}
                          <Text fontWeight={"semibold"}>12345678</Text>
                        </Text>
                        <Box>
                          <Box>
                            <Button onPress={copyToClipboard} variant={"link"}>
                              Хуулах
                            </Button>
                          </Box>
                        </Box>
                      </HStack>
                      <HStack>
                        <Text pt={1} fontSize={"md"} space={2}>
                          Хүлээн авагч:{" "}
                          <Text fontWeight={"semibold"}>
                            Пойнт Плас ХХК
                          </Text>
                        </Text>
                      </HStack>
                      <HStack>
                        <Text pt={1} fontSize={"md"} space={2}>
                          Утга:{" "}
                          <Text fontWeight={"semibold"}>
                            {userData.wallets.phone}
                          </Text>
                        </Text>
                      </HStack>
                    </Box>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button.Group>
                      <Button
                        width={"100%"}
                        variant="ghost"
                        colorScheme="blueGray"
                        onPress={() => {
                          setShowModal(false);
                        }}
                      >
                        <Text
                          textAlign={"center"}
                          color={"#325b77"}
                          fontWeight={"bold"}
                        >
                          Болсон
                        </Text>
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>
          ) : (
            <View></View>
          )}
          <Pressable
            paddingTop={3}
            alignItems={"center"}
            onPress={() => {
              navigation.navigate("BagScreen");
            }}
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"94%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <Feather name="shopping-bag" size={32} color="red" />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          fontSize="md"
                          alignSelf={"center"}
                        >
                          Таны хадгалсан загвар
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
          <Pressable
            paddingTop={3}
            paddingBottom={6}
            alignItems={"center"}
            onPress={() => {
              navigation.navigate("HistoryScreen");
            }}
          >
            {({ isHovered, isPressed }) => {
              return (
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  alignSelf="center"
                  width={"95%"}
                  bg={
                    isPressed
                      ? "coolGray.200"
                      : isHovered
                      ? "coolGray.200"
                      : "coolGray.100"
                  }
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  p="4"
                  rounded="8"
                  shadow={2}
                  borderWidth="0"
                  borderColor="coolGray.300"
                >
                  <HStack>
                    <Box width={"94%"}>
                      <HStack space={2} alignSelf={"flex-start"}>
                        <Box alignSelf="center">
                          <MaterialCommunityIcons
                            name="history"
                            size={32}
                            color="black"
                          />
                        </Box>
                        <Text
                          color="coolGray.800"
                          fontWeight="medium"
                          alignSelf={"center"}
                          fontSize="md"
                        >
                          Худалдан авалтын түүх
                        </Text>
                      </HStack>
                    </Box>
                    <Box width={"6%"} justifyContent="center">
                      <AntDesign name="right" size={20} color="#616161" />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
        </View>

        {loadingStatus === true ? (
          <LoadingDots
            animation="typing"
            containerStyle={{
              position: "absolute",
              height: "100%",
              padding: 18,
              borderRadius: 10,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        ) : (
          <View></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: "120%",
    width: "100%",
  },
});
export default WalletScreen;
