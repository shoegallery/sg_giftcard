import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";
import { Alert, RefreshControl, ScrollView, StatusBar } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
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
  Center,
  Select,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard({ navigation }, props) {
  const successToast = useToast();
  const warnToast = useToast();
  const [userData, setUserData] = useContext(StateContext);
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

  const [showModal, setShowModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  let [language, setLanguage] = useState("0");

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
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#CC5801" />
      <ScrollView
        VirtualizedList-backed
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView>
          <View
            flex={1}
            alignSelf="center"
            alignItems="center"
            width={wp("100%")}
            paddingTop={hp("1%")}
            padding={wp("10%")}
            height={hp("100%")}
            backgroundColor="white"
          >
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
                      colorScheme="orange"
                      variant="subtle"
                      bg="white"
                      borderColor="#CC5801"
                      height={"100%"}
                      marginRight={1}
                      flex={1}
                      success
                      onPress={() => {
                        setShowModal(true);
                      }}
                    >
                      <Box alignItems="center">
                        <Feather
                          name="shopping-bag"
                          size={36}
                          color="#CC5801"
                        />
                      </Box>
                      <Text
                        bold
                        textAlign="center"
                        fontSize="xs"
                        color="#CC5801"
                      >
                        Тооцоо хийх
                      </Text>
                    </Button>
                    {showModal ? (
                      <Center>
                        <Modal
                          isOpen={showModal}
                          onClose={() => setShowModal(false)}
                        >
                          <Modal.Content width={wp("80%")} height={hp("50%")}>
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
                                    fontSize={20}
                                    fontWeight="semibold"
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
                                      placeholder="Салбар сонгоно уу"
                                      selectedValue={receiverPhone.value}
                                      fontSize={20}
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
                                        label="УБИД | Bugatti"
                                        value="10000004"
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
                                        label="Максмоол | Shoe Gallery"
                                        value="10000007"
                                      />
                                      <Select.Item
                                        label="Хүннү-Моол | Shoe Gallery"
                                        value="10000008"
                                      />
                                      <Select.Item
                                        label="Имарт Хан-уул | Shoe Gallery"
                                        value="10000009"
                                      />
                                    </Select>
                                  </Box>
                                </View>
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
                                  height={50}
                                  fontSize={20}
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
                      bg="white"
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
                      <Text bold fontSize="xs" color="#CC5801">
                        Бэлгийн карт
                      </Text>
                    </Button>
                    <Button
                      variant="subtle"
                      colorScheme="orange"
                      bg="white"
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
                        <MaterialIcons
                          name="loyalty"
                          size={36}
                          color="#CC5801"
                        />
                      </Box>
                      <Text bg="red" bold fontSize="xs" color="#CC5801">
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
                                  Санамж: Купон код нь том жижиг үсгийн ялгаатай
                                  5 ширхэг тэмдэгт оруулахыг анхаарна уу
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
                    height: hp("13%"),
                  }}
                >
                  <MyActionButtonComponent navigation={navigation} />
                </View>
                <Text
                  position="absolute"
                  height={wp("10%")}
                  width={wp("95%")}
                  mt={hp("56%")}
                  backgroundColor="red"
                  fontSize="md"
                  color="gray.700"
                  bold
                  textAlign="center"
                >
                  © 2022 Shoe Gallery Mongolia
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </NativeBaseProvider>
  );
}
