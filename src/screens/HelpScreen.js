import { baseUrl } from "../baseUrl";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import {
  Button,
  Modal,

  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,

  useToast,
  Center,
  Select,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";
const Tab = createBottomTabNavigator();
export default function HelpScreen({ navigation }, props) {
  return (<View><Text>Hi</Text></View>)
}
