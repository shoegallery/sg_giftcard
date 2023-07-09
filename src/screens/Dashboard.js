import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  StatusBar,
  View,
  Pressable,
  TouchableHighlight,
  TouchableHighlightComponent,
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

const Tab = createBottomTabNavigator();

export default function Dashboard({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Хэтэвч"
      barStyle={{ backgroundColor: "tomato" }}
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: 11,
          fontWeight: "500",


        },
        
        tabBarStyle: {
          height:50,
          paddingBottom: 2,
          paddingTop: 2,
          width: "100%",
          borderTopLeftRadius: 13, // Specify the top-left border radius
          borderTopRightRadius: 13, // Specify the top-right border radius
        },
      }}
    >
        <Tab.Screen
        name="Хэтэвч"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <MaterialCommunityIcons
                name="wallet-giftcard"
                size={32}
                color="#ff5252"
              />
            ) : (
              <MaterialCommunityIcons
                name="wallet-giftcard"
                size={32}
                color="grey"
              />
            ),
        }}
      />

      <Tab.Screen
        name="Shopping"
        component={ShoppingScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <Feather name="shopping-bag" size={28} color="#ff5252" />
            ) : (
              <Feather name="shopping-bag" size={28} color="grey" />
            ),
        }}
      />
      

    
      <Tab.Screen
        name="Promotion"
        component={LocationScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <Octicons name="video" size={28} color="#ff5252" />
            ) : (
              <Octicons name="video" size={28} color="grey" />
            ),
          // headerLeft: () => {
          //   return (
          //     <TouchableOpacity onPress={() => console.log('click')}>
          //       <View
          //         style={{
          //           width: 30,
          //           height: 30,
          //           justifyContent: 'center',
          //           alignItems: 'center',
          //         }}>
          //         <AntDesign name="left" size={32} color="black" />
          //       </View>
          //     </TouchableOpacity>
          //   );
          // },
        }}
      />
      <Tab.Screen
        name="MySG"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <FontAwesome5 name="star" size={28} color="#ff5252" />
            ) : (
              <FontAwesome5 name="star" size={28} color="grey" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

function WalletScreen({ navigation }) {
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
      style={{ height: hp("100%"), flex: 1, backgroundColor: "#ececec" }}
    >
      <ScrollView
        style={{ alignSelf: "center" }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        VirtualizedList-backed
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            tintColor={"black"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Box alignItems={"center"} height="100%">
          <View style={{ display: "flex" }}>
            <Animatable.View animation="slideInDown" duration={2000}>
              <CartStyle />
            </Animatable.View>
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
                    colorScheme="coolGray"
                    variant="subtle"
                    bg="#ececec"
                    borderColor="#CC5801"
                    height={"90%"}
                    marginRight={1}
                    flex={1}
                    success
                    onPress={() => {
                      setShowModal(true);
                    }}
                  >
                    <Box alignItems="center">
                      <Feather name="shopping-bag" size={36} color="#CC5801" />
                    </Box>
                    <Text
                      width={"100%"}
                      textAlign="center"
                      fontSize="xs"
                      color="#CC5801"
                    >
                      Зарцуулах
                    </Text>
                  </Button>
                  {showModal ? (
                    <Center>
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <Modal.Content width={wp("95%")} height={hp("50%")}>
                          <Modal.CloseButton />
                          <Modal.Header>
                            <Text
                              bold
                              color="#242B2E"
                              fontSize={20}
                              textAlign="center"
                            >
                              Тооцоо хийх
                            </Text>
                          </Modal.Header>
                          <Modal.Body justifyItems="center">
                            <FormControl>
                              <FormControl.Label>
                                <Text
                                  fontSize={18}
                                  fontWeight="normal"
                                  color="gray.700"
                                >
                                  Салбар
                                </Text>
                              </FormControl.Label>
                              <View>
                                <Box>
                                  <Select
                                    height={50}
                                    width={"100%"}
                                    placeholder="Энд дарна уу"
                                    selectedValue={receiverPhone.value}
                                    fontSize={16}
                                    onValueChange={(itemValue) =>
                                      setReceiverPhone({
                                        value: itemValue,
                                        error: "",
                                      })
                                    }
                                  >
                                    <Select.Item
                                      label="Гранд плаза | Shoe Gallery"
                                      value="10000001"
                                    />
                                    <Select.Item
                                      label="УБИД | BASCONI"
                                      value="10000002"
                                    />
                                    <Select.Item
                                      label="УБИД | Sasha Fabiani"
                                      value="10000003"
                                    />
                                
                                    <Select.Item
                                      label="Максмоол | BASCONI"
                                      value="10000005"
                                    />
                                    <Select.Item
                                      label="Максмоол | Sasha Fabiani"
                                      value="10000006"
                                    />
                                 
                                    <Select.Item
                                      label="Хүннү-Моол | Shoe Gallery"
                                      value="10000008"
                                    />
                                   
                                  </Select>
                                </Box>
                              </View>
                            </FormControl>

                            <FormControl.Label>
                              <Text
                                fontSize={18}
                                fontWeight="normal"
                                color="gray.700"
                              >
                                Үнийн дүн
                              </Text>
                            </FormControl.Label>
                            <Box>
                              <Input
                                height={50}
                                fontSize={16}
                                value={String(receiverAmount.value)}
                                returnKeyType="next"
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
                            <Button.Group space={5}>
                              <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                  setShowModal(false);
                                  setReceiverPhone({
                                    value: "",
                                    error: "",
                                  });
                                  setReceiverAmount({
                                    value: "",
                                    error: "",
                                  });
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
                    </Center>
                  ) : (
                    <View></View>
                  )}

                  <Button
                    colorScheme="orange"
                    bg="#ececec"
                    variant="subtle"
                    marginLeft={1}
                    height={"90%"}
                    flex={1}
                    success
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
                  >
                    <Box alignItems="center">
                      <MaterialIcons
                        name="card-giftcard"
                        size={36}
                        color="#CC5801"
                      />
                    </Box>
                    <Text width={"100%"} fontSize="xs" color="#CC5801">
                      Цэнэглэх
                    </Text>
                  </Button>
                  <Button
                    variant="subtle"
                    colorScheme="orange"
                    bg="#ececec"
                    marginLeft={1}
                    height={"90%"}
                    flex={1}
                    bordered
                    success
                    onPress={() => {
                      setShowCouponModal(true);
                    }}
                  >
                    <Box alignItems="center">
                      <MaterialIcons name="loyalty" size={36} color="#CC5801" />
                    </Box>
                    <Text width={"100%"} fontSize="xs" color="#CC5801">
                      Coupon оруулах
                    </Text>
                  </Button>
                  {showCouponModal ? (
                    <Center>
                      <Modal
                        isOpen={showCouponModal}
                        onClose={() => setShowCouponModal(false)}
                      >
                        <Modal.Content width={wp("80%")} height={hp("50%")}>
                          <Modal.CloseButton />
                          <Modal.Body justifyItems="center">
                            <FormControl>
                              <FormControl.Label>
                                <Text
                                  paddingTop={30}
                                  fontSize={20}
                                  fontWeight="semibold"
                                  color="gray.700"
                                  textAlign="center"
                                  alignItems="center"
                                >
                                  Та гар утсандаа хүлээн авсан купон кодоо
                                  оруулна уу
                                </Text>
                              </FormControl.Label>
                            </FormControl>

                            <Box paddingTop={30}>
                              <Input
                                placeholder="Энд дарж оруулна уу"
                                height={50}
                                fontSize={20}
                                value={String(receiverCoupon)}
                                returnKeyType="next"
                                onChangeText={(receiverCouponCode) =>
                                  setReceiverCoupon(receiverCouponCode)
                                }
                                keyboardType="default"
                              />
                              <Text
                                width="100%"
                                fontSize={12}
                                fontWeight="semibold"
                                color="gray.700"
                                flexWrap="wrap"
                                alignItems="flex-start"
                              >
                                Санамж: Купон код нь том жижиг үсгийн ялгаатай 5
                                ширхэг тэмдэгт оруулахыг анхаарна уу
                              </Text>
                            </Box>
                          </Modal.Body>

                          <Modal.Footer>
                            <Button.Group space={5}>
                              <Button
                                onPress={() => {
                                  setShowModal(false);
                                  getCoupon();
                                }}
                              >
                                <Text bold color="white">
                                  Кодыг идэвхжүүлэх
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
                </View>
              </VStack>
            </View>
          </View>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
