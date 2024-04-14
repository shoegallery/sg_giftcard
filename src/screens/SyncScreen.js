import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
  UIManager,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import BackButton from "../components/BackButton";
import { NumericFormat } from "react-number-format";
import moment from "moment";

import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  HStack,
  Spacer,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  useToast,
  Center,
  Select,
  IconButton,
} from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { ScrollView } from "react-native-virtualized-view";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

const SyncScreen = ({ navigation }) => {
  const [userDatas, setUserDatas] = useState(false);
  console.log(userDatas);
  /**  const getData = () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://192.168.1.5:8080/api/v1/wallets/list',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                setUserDatas(response.data.data)

            })
            .catch((error) => {
                console.log(error);
            });
    }**/

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton goBack={navigation.goBack} />,
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      <Box height={"100%"} justifyContent={"center"}>
        <Text fontWeight={"semibold"} paddingTop={5} textAlign={"center"}>
          Уучлаарай байгууллагын санхүүгийн програмтай холбогдоогүй байна
        </Text>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    minHeight: height * 0.7,
    width,
    backgroundColor: "blue",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default SyncScreen;
