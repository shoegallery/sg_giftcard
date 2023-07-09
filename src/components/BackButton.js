import React from "react";
import { StyleSheet, View, Platform, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity style={{ height: "100%", width: 50, justifyContent: "center", alignItems: "center" }} onPress={goBack}><AntDesign name="arrowleft" size={24} color="black" /></TouchableOpacity>
  );
}
