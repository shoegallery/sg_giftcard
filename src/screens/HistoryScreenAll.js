import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  Platform,
  UIManager,
  SafeAreaView,
  ScrollView,
} from "react-native";
import moment from "moment";

import { NumericFormat } from "react-number-format";

import { Box, HStack, VStack, Text, Spacer, Center } from "native-base";
import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const HistoryScreenAll = ({ navigation }) => {
  const [userTransactionDataAll, setUserTransactionDataAll] = useState([]);

  const userTransactionHistoryAll = () => {
    let datas = JSON.stringify({});

    let config = {
      method: "POST",
      url: `${baseUrl}/transactions/list/universal`,
      headers: {
        "Content-Type": "application/json",
      },

      data: datas,
    };
    axios(config)
      .then((response) => {
        setUserTransactionDataAll(response.data.data);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    userTransactionHistoryAll();
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
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
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      {userTransactionDataAll.length > 0 ? (
        <ScrollView>
          {userTransactionDataAll.map((item, index) => (
            <View style={{ paddingTop: 5, paddingBottom: 5 }} key={index}>
              <Box
                alignSelf="center"
                justifyContent="center"
                width={"90%"}
                key={item._id}
                borderBottomWidth="2"
                _dark={{
                  borderColor: "gray.600",
                }}
                borderColor="gray.300"
              >
                <View>
                  <HStack justifyContent="space-between">
                    <VStack justifyContent="center" width="70%">
                      <Text
                        fontSize={16}
                        color={
                          item.trnxType === "Зарлага" ? "red.400" : "green.500"
                        }
                        fontWeight={"semibold"}
                      >
                        {item.trnxType}
                      </Text>
                      <Text
                        fontSize={11}
                        color="#242B2E"
                        _dark={{
                          color: "warmGray.200",
                        }}
                      >
                        {item.summary}
                      </Text>
                    </VStack>
                    <Spacer />
                    <NumericFormat
                      value={item.amount.$numberDecimal}
                      displayType={"text"}
                      thousandSeparator={true}
                      renderText={(formattedValue) => (
                        <Text
                          fontWeight={"semibold"}
                          width="30%"
                          textAlign="right"
                          justifyContent="flex-end"
                          alignSelf="center"
                          fontSize={16}
                          color={
                            item.trnxType === "Зарлага"
                              ? "red.400"
                              : "green.400"
                          }
                        >
                          {item.trnxType === "Зарлага" ? "-" : "+"}
                          {formattedValue}₮
                        </Text>
                      )}
                    />
                  </HStack>
                  <Box paddingBottom={"2"} width={"100%"}>
                    <HStack>
                      <Box width={"50%"}>
                        <Text fontSize={10} color="#242B2E">
                          {moment(item.createdAt).format("YYYY-MM-DD LT")}
                        </Text>
                      </Box>
                      <Box width={"50%"}>
                        <NumericFormat
                          value={item.balanceAfter.$numberDecimal}
                          displayType={"text"}
                          thousandSeparator={true}
                          renderText={(formattedValue) => (
                            <Text bold textAlign="right" fontSize={10}>
                              Үлдэгдэл: {formattedValue}₮
                            </Text>
                          )}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </View>
              </Box>
            </View>
          ))}
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
              <Text fontWeight={"semibold"} paddingTop={5} textAlign={"center"}>
                Уучлаарай гүйлгээ алга байна
              </Text>
            </Center>
          </Box>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreenAll;
