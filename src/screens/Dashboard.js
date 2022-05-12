import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";

import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { StateContext } from "../Context/StateContext";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useContext(StateContext);
  console.log(userData);
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
        <View>
          <Image
            source={imageSource}
            style={{
              position: "relative",
              justifyContent: "center",
              alignSelf: "center",
              width: wp("95%"),
              maxHeight: hp("30%"),
              resizeMode: "contain",
            }}
          ></Image>
        </View>
        <View style={{ flex: 3, position: "relative" }}>
          <Header style={{ position: "relative" }}>Let’s start</Header>
          <Paragraph style={{ position: "relative" }}>
            Your amazing app starts here. Open you favorite code editor and
            start editing this project.
          </Paragraph>
          <Button
            style={{ position: "relative" }}
            mode="outlined"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
              })
            }
          >
            Logout
          </Button>
        </View>
      </View>
    </Background>
  );
}
