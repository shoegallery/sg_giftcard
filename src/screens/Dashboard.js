import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";

import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import NumberFormat from "react-number-format";

import { StateContext } from "../Context/StateContext";
import { Button, VStack, Text, NativeBaseProvider } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useContext(StateContext);
  console.log(userData.wallets);
  console.log(userData.wallets.walletType);
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
    <Background>
      <View style={{ flexDirection: "column", display: "flex" }}>
        <View style={{ position: "relative" }}>
          <Image
            source={imageSource}
            style={{
              flex: 1,

              alignSelf: "center",
              position: "absolute",
              maxHeight: hp("35%"),
              width: wp("95%"),
              resizeMode: "contain",
            }}
          ></Image>
          <View
            style={{
              position: "absolute",
              marginTop: hp("20%"),
              marginLeft: wp("1%"),
            }}
          >
            <NumberFormat
              value={userData.wallets.balance.$numberDecimal}
              displayType={"text"}
              thousandSeparator={true}
              renderText={(formattedValue) => (
                <View>
                  <Text color="white" fontSize="xl">
                    Хэтэвчинд
                  </Text>
                  <Text bold paddingTop={0} color="white" fontSize="2xl">
                    {formattedValue}₮
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={{ height: hp("65%"), paddingTop: hp("35%") }}>
          <Button bordered success>
            <Text>Success</Text>
          </Button>
          <Header style={{ position: "relative" }}>Let’s start</Header>
          <Paragraph style={{ position: "relative" }}>
            Your amazing app starts here. Open you favorite code editor and
            start editing this project.
          </Paragraph>

          <Button
            backgroundColor="#7986CB"
            shadow={2}
            size="md"
            mode="contained"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
              })
            }
          >
            <Text fontSize="xl" bold color="white">
              Logout
            </Text>
          </Button>
        </View>
      </View>
    </Background>
  );
}
