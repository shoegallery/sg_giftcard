import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
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
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
  Ionicons,
  Foundation,
  FontAwesomeIcon,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { HeaderBackContext } from "@react-navigation/elements";

import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
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
import ProfileScreen from "./ProfileScreen";
import TestScreen from "./TestScreen";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchScreen from "./SearchScreen";
import ShoppingScreen from "./ShoppingScreen";
import LocationScreen from "./LocationScreen";
import WalletScreen from "./WalletScreen";
import LoginScreen from "./LoginScreen";
import PromotionScreen from "./PromotionScreen";

const Tab = createBottomTabNavigator();

export default function TabbarScreen({ navigation }) {
 
  return (
    <Tab.Navigator
      initialRouteName="Shopping"
      barStyle={{ backgroundColor: "tomato" }}
   
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarOptions:{
          style: { height: 50 }, // Adjust the height as per your requirements
        },
        tabBarStyle: {
          height: 50,
          paddingBottom: 2,
          paddingTop: 2,
          width: "100%",
          borderTopLeftRadius: 13, // Specify the top-left border radius
          borderTopRightRadius: 13, // Specify the top-right border radius
        },
      }}
    >
      <Tab.Screen
        name="Хэтэвч"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <MaterialCommunityIcons
                name="wallet-giftcard"
                size={32}
                color="#ff5252"
              />
            ) : (
              <MaterialCommunityIcons
                name="wallet-giftcard"
                size={32}
                color="grey"
              />
            ),
        }}
      />
      <Tab.Screen
        name="Shopping"
        component={ShoppingScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <Feather name="shopping-bag" size={28} color="#ff5252" />
            ) : (
              <Feather name="shopping-bag" size={28} color="grey" />
            ),
        }}
      />

      <Tab.Screen
        name="PromotionScreen"
        component={PromotionScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <Octicons name="video" size={28} color="#ff5252" />
            ) : (
              <Octicons name="video" size={28} color="grey" />
            ),
        }}
      />
      <Tab.Screen
        name="Тусламж"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) =>
            focused ? (
              <FontAwesome5 name="star" size={28} color="#ff5252" />
            ) : (
              <FontAwesome5 name="star" size={28} color="grey" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
