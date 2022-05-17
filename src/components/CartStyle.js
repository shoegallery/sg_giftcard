import React, { useContext, useState } from "react";
import {
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
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
  View,
  Modal,
  Button,
  SectionList,
  Container,
  Center,
  NativeBaseProvider,
  Heading,
  Avatar,
} from "native-base";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const TransActionsList = () => {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  return (
    <Box>
      <ScrollView>
        {userTransactionData.map((item, index) => (
          <Box
            height="10%"
            alignItems="center"
            justifyContent="center"
            width={wp("80%")}
            key={item._id}
            borderBottomWidth="2"
            _dark={{
              borderColor: "gray.600",
            }}
            borderColor="gray.300"
          >
            <HStack height={16} justifyContent="space-between">
              <VStack
                justifyContent="center"
                width={wp("50%")}
                backgroundColor="red"
              >
                <Text fontSize={16} color="coolGray.800" bold>
                  {item.trnxType}
                </Text>
                <Text
                  fontSize={10}
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  {item.summary}
                </Text>

                <Text fontSize={10} color="coolGray.800" bold>
                  {item.createdAt}
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
                    textAlign="right"
                    justifyContent="flex-end"
                    alignSelf="center"
                    fontSize="md"
                    color="coolGray.800"
                  >
                    {formattedValue}₮
                  </Text>
                )}
              />
            </HStack>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
};

export default function CartStyle() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useContext(StateContext);

  var imageSource;
  if (userData.wallets.walletType === "member") {
    imageSource = require("../assets/cardTypes/member.png");
  } else if (userData.wallets.walletType === "rosegold") {
    imageSource = require("../assets/cardTypes/rosegold.png");
  } else if (userData.wallets.walletType === "golden") {
    imageSource = require("../assets/cardTypes/golden.png");
  } else if (userData.wallets.walletType === "platnium") {
    imageSource = require("../assets/cardTypes/platnium.png");
  }
  return (
    <View>
      <Image
        source={imageSource}
        style={{
          alignSelf: "center",
          position: "relative",
          maxHeight: hp("35%"),
          width: wp("95%"),
          resizeMode: "contain",
        }}
      />
      <View
        style={{
          position: "absolute",
          paddingTop: hp("19%"),
          marginLeft: wp("10%"),
        }}
      >
        <NumberFormat
          value={userData.wallets.balance.$numberDecimal}
          displayType={"text"}
          thousandSeparator={true}
          renderText={(formattedValue) => (
            <View>
              <Text color="white" bold fontSize="md">
                Хэтэвчинд
              </Text>
              <Text bold paddingTop={-10} color="white" fontSize="2xl">
                {formattedValue}₮
              </Text>
              <Button
                position="relative"
                marginLeft={wp("58%")}
                alignContent="center"
                marginTop={-5}
                variant="Outline"
                onPress={() => {
                  setModalVisible(true);
                }}
                height={12}
              >
                {modalVisible ? (
                  <SafeAreaView>
                    <ScrollView scrollEnabled={true}>
                      <Modal
                        alignItems="center"
                        justifyContent="center"
                        size="xl"
                        isOpen={modalVisible}
                        onClose={setModalVisible}
                        width={wp("100%")}
                      >
                        <Modal.Content height={hp("90%")}>
                          <Modal.Header textAlign="center">
                            Гүйлгээний хуулга
                          </Modal.Header>
                          <Modal.Body>
                            {modalVisible ? (
                              <NativeBaseProvider>
                                <Center flex={1}>
                                  <TransActionsList />
                                </Center>
                              </NativeBaseProvider>
                            ) : (
                              <View></View>
                            )}
                          </Modal.Body>

                          <Modal.Footer>
                            <Button.Group space={2}>
                              <Button
                                onPress={() => {
                                  setModalVisible(false);
                                }}
                              >
                                Болсон
                              </Button>
                            </Button.Group>
                          </Modal.Footer>
                        </Modal.Content>
                      </Modal>
                    </ScrollView>
                  </SafeAreaView>
                ) : (
                  <SafeAreaView></SafeAreaView>
                )}

                <Text alignItems="flex-start" bold color="white" fontSize="lg">
                  Хуулга <AntDesign name="right" size={14} color="white" />
                </Text>
              </Button>
            </View>
          )}
        />
      </View>
    </View>
  );
}
