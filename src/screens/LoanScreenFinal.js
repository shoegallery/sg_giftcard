import { baseUrl } from "../baseUrl";
import axios from "axios";

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Dimensions,
  Platform,
  UIManager,
  ScrollView,
  StyleSheet,
  Image,
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
import moment from "moment";

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
  Spacer,
  Pressable,
} from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const LoanScreenFinal = ({ navigation, route }) => {
  const [userData, setUserData] = useContext(StateContext);
  const [canGoBack, setCanGoBack] = useState(false);
  const [onChangeValue, setOnChangeValue] = React.useState(2);

  const [receiverAmount, setReceiverAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
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

  const checkOut = (dataOne, dataTwo) => {
    console.log("Hi" + dataOne + "        " + dataTwo);

    if (parseInt(dataOne) > 0) {
      var request = JSON.stringify({
        id: dataTwo,
        toPhone: 70000001,
        phone: userData.wallets.phone,
        walletSuperId: userData.wallets.walletSuperId,
        amount: dataOne,
      });
      var config = {
        method: "POST",
        url: `${baseUrl}/wallets/endloan`,
        headers: {
          "Content-Type": "application/json",
        },
        data: request,
      };
      axios(config)
        .then(function (response) {
          console.log("--------" + response.data.success);
          if (response.data.success === true) {
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
    }
  };

  useEffect(() => {
    InternetCheck();
    setReceiverAmount("");
    setReceiverId("");
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      title: "LoanScreenFinal",
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
      <View style={{ height: hp("100%") - 50, backgroundColor: "#f2f2f2" }}>
        {userLoanData.length > 0 ? (
          <ScrollView>
            <Box
              marginLeft={1 / 2}
              justifyContent="center"
              justifyItems={"right"}
            >
              <Text
                fontWeight={"semibold"}
                alignSelf={"center"}
                marginTop={2}
                fontSize={"xl"}
                color="#325b77"
              >
                Таны авсан зээлүүд
              </Text>
            </Box>
            <View style={styles.container}>
              {userLoanData.map((loan) => (
                <Pressable
                  disabled={loan.close.toString() === "false" ? false : true}
                  key={loan._id}
                  width={"95%"}
                  paddingTop={3}
                  alignItems={"center"}
                  onPress={() => {
                    {
                      console.log(receiverId);
                      Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Та зээлээ бүтэн төлөх үү?",
                        textBody: "",
                        button: "Yes 😎",
                        onPressButton: async () => {
                          Dialog.hide();
                          checkOut(loan.amount.$numberDecimal, loan._id);
                        },
                      });
                    }
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
                        bg={isPressed ? "white" : "white"}
                        style={{
                          transform: [
                            {
                              scale: isPressed ? 0.95 : 1,
                            },
                          ],
                        }}
                        p="4"
                        rounded="8"
                        shadow={2}
                        borderWidth="0"
                        borderColor="coolGray.300"
                      >
                        <View style={styles.loan}>
                          <Text style={styles.amount}>
                            Нийт дүн: {loan.amount.$numberDecimal}
                          </Text>

                          <Text style={styles.createdAt}>
                            Авсан огноо:{" "}
                            {moment(loan.createdAt).format("YYYY-MM-DD")}
                          </Text>

                          <Text style={styles.close}>
                            Төлөв:{" "}
                            {loan.close.toString() === "false"
                              ? "Идэвхтэй"
                              : "Төлөгдсөн"}
                          </Text>
                          {loan.loan.map((loanItem) => (
                            <View key={loanItem.index} style={styles.loanItem}>
                              <Text style={styles.amountsmall}>
                                Төлөх дүн: {loanItem.amount}
                              </Text>
                              <Text style={styles.date}>
                                Төлөх огноо:{" "}
                                {moment(loan.createdAt).format("YYYY-MM-DD")}
                              </Text>
                              <Text style={styles.status}>
                                Status: {loanItem.status.toString()}
                              </Text>
                            </View>
                          ))}
                          <Text
                            fontWeight={"semibold"}
                            pl={"3"}
                            fontSize={"md"}
                          >
                            <Text
                              fontWeight={"black"}
                              fontSize={"lg"}
                              color={"#6172f3"}
                            >
                              + 10{" "}
                            </Text>
                            <Text
                              fontWeight={"black"}
                              fontSize={"md"}
                              color={"#6172f3"}
                            >
                              PPC
                            </Text>
                          </Text>
                        </View>
                      </Box>
                    );
                  }}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Box>
              <Center>
                <Image
                  source={require("../assets/empty.png")}
                  style={{
                    height: 100,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                />
                <Text
                  fontWeight={"semibold"}
                  paddingTop={5}
                  textAlign={"center"}
                >
                  Уучлаарай зээл алга байна
                </Text>
              </Center>
            </Box>
          </View>
        )}
        <Center>
          <Box justifyItems={"right"}></Box>
        </Center>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  loan: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  amount: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#6172F3",
    marginBottom: 10,
  },
  amountsmall: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  createdAt: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  updatedAt: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  close: {
    fontSize: 18,
    color: "#6172F3",
    marginBottom: 10,
  },
  loanItem: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  index: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#333",
  },
  status: {
    fontSize: 14,
    color: "#333",
  },
});

export default LoanScreenFinal;
