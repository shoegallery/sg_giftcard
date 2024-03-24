import React, { useState, useEffect, useContext } from "react";
import { baseUrl } from "../baseUrl";
import axios from "axios";

import NumberFormat from "react-number-format";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  StatusBar,
  View,
  TouchableHighlight,
  TouchableHighlightComponent,
  IconButton,
  Icon,
} from "react-native";
import * as vectorIcons from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";

import Product from "../components/Product";
import AppBar from "../components/AppBar";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  useToast,
  Center,
  Select,
  HStack,
  PresenceTransition,
  AlertDialog,
  Pressable,
  Spacer,
  Flex,
  Badge,
  CheckIcon,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CleanTabBar } from "react-navigation-tabbar-collection";

import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";

import TestScreen from "./TestScreen";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchScreen from "./SearchScreen";
import ShoppingScreen from "./ShoppingScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LoginScreen,
  ProfileScreen,
  LoginAuthScreen,
  LocationScreen,
  TermScreen,
  PurchaseScreen,
  TransferScreen,
  GetCouponScreen,
  BagScreen,
  HistoryScreen,
  WalletScreen,
  TabbarScreen,
  PromotionScreen,
  CompilationScreen,
  ScanScreen
} from "../screens";

const Stack = createStackNavigator();
const StackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
      options={{}}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="LoginAuthScreen" component={LoginAuthScreen} />
      <Stack.Screen name="TabbarScreen" component={TabbarScreen} />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "GetCouponScreen",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="GetCouponScreen"
        component={GetCouponScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "PurchaseScreen",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="PurchaseScreen"
        component={PurchaseScreen}
      />
     <Stack.Screen
        options={{
          headerShown: true,
          title: "ScanScreen",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="ScanScreen"
        component={ScanScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "BagScreen",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="BagScreen"
        component={BagScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Худалдан авалтын түүх",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            alignContent: "center",
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="HistoryScreen"
        component={HistoryScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Үйлчилгээний нөхцөл",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            backgroundColor: "white",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="TermScreen"
        component={TermScreen}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          title: "Дэлгүүрийн хаяг",
          backgroundColor: "#ececec",
          headerTintColor: "#ececec",
          headerStyle: { backgroundColor: "white", borderRadius: 0 },
          headerTitleStyle: {
            width: "100%",
            fontSize: 17,
            color: "black",
            fontWeight: "500",
            fontFamily: "regular",
            textAlign: Platform.OS === "android" ? "center" : "auto",
          },
        }}
        name="LocationScreen"
        component={LocationScreen}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
