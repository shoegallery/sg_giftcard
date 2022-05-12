import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { StateContext } from "../Context/StateContext";

import { golden, platnium, rosegold, member } from "../assets/cardTypes";

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
      <Image source={imageSource} style={{ width: "50%" }}></Image>
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button
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
    </Background>
  );
}
