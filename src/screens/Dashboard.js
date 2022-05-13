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
      <View style={{ display: "flex" }}>
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
          ></Image>
          <View
            style={{
              position: "absolute",
              marginTop: hp("20%"),
              marginLeft: wp("10%"),

              padding: 1,
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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: hp("45%"),
            width: wp("95%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: wp("95%"),
              position: "absolute",
              height: hp("6%"),
            }}
          >
            <Button
              variant="subtle"
              borderWidth={3}
              backgroundColor="#EEE4AB"
              borderColor="#ECB390"
              borderRadius={10}
              height={16}
              marginRight={1}
              flex={1}
              bordered
              success
            >
              <Text bold fontSize="lg" color="#4E3620">
                Худалдан авалт
              </Text>
            </Button>
            <Button
              isDisabled
              variant="subtle"
              borderWidth={3}
              backgroundColor="#EEEDDE"
              borderColor="#898B8A"
              borderRadius={10}
              marginLeft={1}
              height={16}
              flex={1}
              bordered
              success
            >
              <Text bold fontSize="lg" color="#898B8A">
                Цэнэглэлт
              </Text>
            </Button>
          </View>
          <View style={{ paddingTop: 100 }}>
            <Header style={{}}>Let’s start</Header>
            <Paragraph style={{ position: "relative" }}>
              Your amazing app starts here. Open you favorite code editor and
              start editing this project.
            </Paragraph>
            <View style={{ justifyContent: "flex-end" }}>
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
        </View>
      </View>
    </Background>
  );
}
