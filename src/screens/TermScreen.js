import { baseUrl } from "../baseUrl";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Platform, UIManager, StatusBar, SafeAreaView } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { phoneValidator } from "../helpers/phoneValidator";
import { amountValidator } from "../helpers/amountValidator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StateContext, StateContextHistory } from "../Context/StateContext";
import Product from "../components/Product";
import BackButton from "../components/BackButton"
import { MaterialIcons, Feather, Entypo, AntDesign, FontAwesome5, MaterialCommunityIcons, FontAwesome, Octicons } from "@expo/vector-icons";
import { Button, Modal, Text, NativeBaseProvider, FormControl, Input, Box, VStack, Heading, useToast, Center, Select, IconButton } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AccordionList } from "react-native-accordion-list-view";
import CartStyle from "../components/CartStyle";
import MyActionButtonComponent from "../components/MyActionButtonComponent";
import { ScrollView } from 'react-native-virtualized-view'
import * as Animatable from "react-native-animatable";

const Tab = createBottomTabNavigator();

export default function TermScreen({ navigation }) {
  const data = [
    {
        id: 0,
        title: 'Ерөнхий дүрэм',
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
        id: 1,
        title: 'Lorem Ipsum is simply dummy',
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      id: 2,
      title: 'Lorem Ipsum is simply dummy',
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton goBack={navigation.goBack} />
      ),
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);

  return (
    <SafeAreaView>
            <View style={styles.container}>
                <AccordionList
                    data={data}
                    customTitle={item => <Text>{item.title}</Text>}
                    customBody={item => <Text>{item.body}</Text>}
                    animationDuration={400}
                    expandMultiple={true}
                />
            </View>
        </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
      paddingVertical: '2%',
      paddingHorizontal: '3%',
      height: '100%',
      backgroundColor: '#e7e7e7',
  },
});