import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import NumberFormat from "react-number-format";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  StatusBar,
  View,
  TouchableHighlight,
  TouchableHighlightComponent,
  IconButton,
  Icon,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
  Ionicons,
  Foundation,
  FontAwesomeIcon,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { HeaderBackContext } from "@react-navigation/elements";

import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import AppBar from "../components/AppBar";
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
  useToast,
  Center,
  Select,
  HStack,
  PresenceTransition,
  AlertDialog,
  Pressable,
  Spacer,
  Flex,
  Badge,
  CheckIcon,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CleanTabBar } from "react-navigation-tabbar-collection";

import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from "./ProfileScreen";
import TestScreen from "./TestScreen";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchScreen from "./SearchScreen";
import ShoppingScreen from "./ShoppingScreen";
import LocationScreen from "./LocationScreen";

export default function WalletScreen({ navigation }) {
  const successToast = useToast();
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);

  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

  const [showModal, setShowModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });
  const [receiverCoupon, setReceiverCoupon] = useState("");

  const [refreshing, setRefreshing] = useState(false);
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
          setShowCouponModal(false);
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
          setShowCouponModal(false);
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
          setShowCouponModal(false);
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
          setShowCouponModal(false);
          setReceiverCoupon("");
        }
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
    } catch (err) {
      {
      }
    }
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
    setShowCouponModal(false);
    setShowModal(false);
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
        height: hp("100%"),
        width: "100%",
        flex: 1,
        backgroundColor: "#ececec",
      }}
    >
      <View style={{ height: "20%", backgroundColor: "red" }}></View>
      <View style={{ height: "80%", backgroundColor: "orange" }}>
        <Pressable
          paddingTop={50}
          alignItems={"center"}
          onPress={() => {
            navigation.navigate("PurchaseScreen");
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
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"42%"} justifyContent="center">
                    <NumberFormat
                      value={userData.wallets.balance.$numberDecimal}
                      displayType={"text"}
                      thousandSeparator={true}
                      renderText={(formattedValue) => (
                        <Text
                          bold
                          textAlign="right"
                          color="#00308F"
                          fontSize={18}
                        >
                          {formattedValue}₮
                        </Text>
                      )}
                    />
                  </Box>
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            );
          }}
        </Pressable>
        <Pressable paddingTop={3} alignItems={"center"}>
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
                  <Box width={"92%"}>
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
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
                  <Box width={"92%"}>
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
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
              title: "Тун удахгүй",
              placement: "top",
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
                  <Box width={"92%"}>
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
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
                  <Box width={"92%"}>
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
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
                  <Box width={"92%"}>
                    <HStack space={3} alignSelf={"flex-start"}>
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
                  <Box width={"8%"} justifyContent="center">
                    <AntDesign name="right" size={28} color="#616161" />
                  </Box>
                </HStack>
              </Box>
            );
          }}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
