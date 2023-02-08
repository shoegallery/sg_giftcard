import React, { useContext, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { StateContextHistory, StateContext } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Text,
  Box,
  HStack,
  Spacer,
  VStack,
  Center,
  Modal,
  Button,
  Flex, Heading
} from "native-base";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import * as Animatable from "react-native-animatable";
const TransActionsList = () => {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  console.log(userTransactionData);
  return (
    <View height={"100%"}>{
      userTransactionData.length > 0 ? (
        <ScrollView>{
          userTransactionData.map((item, index) => (

            <View key={index}>
              <Box
                alignItems="center"
                justifyContent="center"
                width={"100%"}
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
                          item.trnxType === "Зарлага"
                            ? "red.400"
                            : "green.500"
                        }
                        bold
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
                    <NumberFormat
                      value={item.amount.$numberDecimal}
                      displayType={"text"}
                      thousandSeparator={true}
                      renderText={(formattedValue) => (
                        <Text
                          bold
                          width="30%"
                          textAlign="right"
                          justifyContent="flex-end"
                          alignSelf="center"
                          fontSize={14}
                          color={
                            item.trnxType === "Зарлага"
                              ? "red.400"
                              : "green.400"
                          }
                        >
                          {formattedValue}₮
                        </Text>
                      )}
                    />
                  </HStack>
                  <Box paddingBottom={"2"} width={"100%"}>
                    <HStack>
                      <Box width={"70%"}>
                        <Text fontSize={10} color="#242B2E">
                          {moment(item.createdAt).format("YYYY-MM-DD LT")}
                        </Text>
                      </Box>
                      <Box width={"30%"}>
                        <NumberFormat
                          value={item.balanceBefore.$numberDecimal}
                          displayType={"text"}
                          thousandSeparator={true}
                          renderText={(formattedValue) => (
                            <Text bold textAlign="right" fontSize={10}>
                              {formattedValue}₮
                            </Text>
                          )}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </View>
              </Box>
            </View>

          ))}</ScrollView>
      ) : (

        <View style={{ paddingTop: 100 }}><Box height={"100%"} justifyContent={"center"} ><View style={{ justifyItems: "center", }}><Image
          source={require("../assets/empty.png")}
          style={{
            height: 100,
            alignSelf: "center",
            justifyItems: "center",

            resizeMode: "contain",
          }}
        />
        </View><Text paddingTop={5} bold textAlign={"center"}>Уучлаарай гүйлгээ алга байна</Text></Box></View>

      )
    }</View>


  );
};

export default function CartStyle() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useContext(StateContext);
  console.log(userData);
  var imageSource;
  if (userData !== undefined) {
    if (userData.wallets.walletType === "member") {
      imageSource = require("../assets/cardTypes/member.png");
    } else if (userData.wallets.walletType === "rosegold") {
      imageSource = require("../assets/cardTypes/rosegold.png");
    } else if (userData.wallets.walletType === "golden") {
      imageSource = require("../assets/cardTypes/golden.png");
    } else if (userData.wallets.walletType === "platnium") {
      imageSource = require("../assets/cardTypes/platnium.png");
    }
  }
  return (
    <View>
      <Image
        source={imageSource}
        style={{
          justifyContent: "center",
          position: "relative",
          maxHeight: hp("35%"),
          width: wp("95%"),
          resizeMode: "contain",
        }}
      />
      <View
        style={{
          position: "absolute",
          paddingTop: hp("12%"),
          marginLeft: wp("10%"),
        }}
      >
        <NumberFormat
          value={userData.wallets.balance.$numberDecimal}
          displayType={"text"}
          thousandSeparator={true}
          renderText={(formattedValue) => (
            <View backgroundColor={"transparent"}>
              <Text color="white" fontSize="md">
                Хэтэвчний үлдэгдэл
              </Text>

              <Text bold color="white" fontSize="2xl">
                {formattedValue}₮
              </Text>

              <Text
                onPress={() => {
                  setModalVisible(true);
                }}
                color="white"
                fontSize="md"
              >
                Хуулга <AntDesign name="right" size={14} color="white" />
              </Text>
              {modalVisible ? (
                <Animatable.View
                  animation="fadeInDown"
                  duration={1000}
                >
                  <Modal
                    alignItems="center"
                    justifyContent="center"
                    size="xl"
                    isOpen={modalVisible}
                    onClose={setModalVisible}
                    width={"100%"}
                  >
                    <Modal.Content height={"90%"}>
                      <Modal.Header borderRadius={0}>
                        <Text
                          color="#242B2E"
                          fontSize={20}
                          textAlign="center"
                        >
                          Гүйлгээний хуулга
                        </Text>
                      </Modal.Header>
                      <Modal.Body height="full">
                        {modalVisible ? <TransActionsList /> : <View></View>}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Center alignSelf={"center"}>
                            <Button
                              width={"24"}
                              borderRadius={0}
                              onPress={() => {
                                setModalVisible(false);
                              }}
                            >
                              <Text bold color="white">
                                Хаах
                              </Text>
                            </Button>
                          </Center>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal></Animatable.View>
              ) : (
                <View></View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}
