import React, { useContext, useState } from "react";
import { Image, ScrollView } from "react-native";
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
} from "native-base";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";

const TransActionsList = () => {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  return (
    <Box>
      <SafeAreaView>
        <ScrollView>
          <View>
            {userTransactionData.map((item) => (
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
                <HStack height={75} justifyContent="space-between">
                  <VStack justifyContent="center" width="70%">
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
                      {Date(item.createdAt)}
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
                        color="coolGray.800"
                      >
                        {formattedValue}₮
                      </Text>
                    )}
                  />
                </HStack>
              </Box>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
          paddingTop: hp("10%"),
          marginLeft: wp("10%"),
        }}
      >
        <NumberFormat
          value={userData.wallets.balance.$numberDecimal}
          displayType={"text"}
          thousandSeparator={true}
          renderText={(formattedValue) => (
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  marginLeft: wp("-2%"),
                  height: wp("20%"),
                  width: wp("20%"),
                  marginBottom: hp("1%"),
                }}
              >
                <QRCode size={wp("18%")} value={userData.phone} />
              </View>

              <Text color="white" bold fontSize="md">
                Хэтэвчинд
              </Text>
              <Text bold color="white" fontSize="2xl">
                {formattedValue}₮
              </Text>
              <Button
                position="relative"
                marginLeft={wp("57%")}
                alignContent="center"
                marginTop={-5}
                variant="Outline"
                onPress={() => {
                  setModalVisible(true);
                }}
                height={12}
              >
                {modalVisible ? (
                  <Modal
                    alignItems="center"
                    justifyContent="center"
                    size="xl"
                    isOpen={modalVisible}
                    onClose={setModalVisible}
                    width={"100%"}
                  >
                    <Modal.Content height={"90%"}>
                      <Modal.Header textAlign="center">
                        Гүйлгээний хуулга
                      </Modal.Header>
                      <Modal.Body height="full">
                        {modalVisible ? <TransActionsList /> : <View></View>}
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
                ) : (
                  <View></View>
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
