import React, { useContext } from "react";
import { Image, StyleSheet, Alert, RefreshControl } from "react-native";
import { StateContextHistory, StateContext } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text, View, Button } from "native-base";
import NumberFormat from "react-number-format";
import { AntDesign } from "@expo/vector-icons";

export default function CartStyle() {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

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
                paddingTop={-hp("1%")}
                variant="Outline"
                onPress={() => {
                  console.log("aahaiaaa");
                }}
                height={12}
              >
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
