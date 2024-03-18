
import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,

  View,
  TouchableOpacity,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner-plus';


import { StateContext, StateContextHistory } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  Text,
  useDisclose,
  Center,
  Button,
  Icon,
  HStack,
  Actionsheet,
  Box
} from "native-base";
const ScanScreen = ({ navigation }, props) => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const [canGoBack, setCanGoBack] = useState(false)

  const [isScan, setIsScan] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useContext(StateContext);
  const [receiverPhone, setReceiverPhone] = useState({ value: "", error: "" });
  const [receiverAmount, setReceiverAmount] = useState({
    value: "",
    error: "",
  });
  const onStartPress = () => {
    setIsScan(true);
  };

  const onStopPress = async () => {

    setScanned(false);
  };

  const requestPermissionsAsync = async () => {
    let permis = await BarCodeScanner.getPermissionsAsync();
    if (permis["status"] !== "granted") permis = await BarCodeScanner.requestPermissionsAsync();
    setIsScan(permis["status"] === "granted");

  };

  const onBarCodeScanned = async (result) => {
    if (isScan === true) {
      if (result["data"].length === 8) {
        setIsScan(true);
        console.log(result["data"]);
        console.log(result["data"].length);
        navigation.navigate("PurchaseScreen", { data: result["data"] });
        let permis = await BarCodeScanner.getPermissionsAsync();
      }
    }

  };
  const checkOut = () => {
    InternetCheck();
    const receiverPhoneError = phoneValidator(receiverPhone.value);
    const receiverAmountError = amountValidator(receiverAmount.value);

    if (receiverAmountError || receiverPhoneError) {
      setReceiverAmount({ ...receiverAmount, error: receiverAmountError });
      setReceiverPhone({ ...receiverPhone, error: receiverPhoneError });
      Alert.alert(
        "Та шилжүүлгийн мэдээллээ зөв оруулна уу",
        `Салбарыг заавал сонгоно, үнийн дүнд зөвхөн тоо агуулна.`,
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    }
  }


  useEffect(() => {
    setIsScan(false);
    // Check and request camera permission on mount
   
   

    requestPermissionsAsync()
    const listenerUnsubscribe = navigation.addListener('focus', () => {
      setCanGoBack(navigation.canGoBack())
    })
    return () => listenerUnsubscribe()
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{
          width: wp("100%"), height: hp("80%"), overflow: "hidden", justifyContent: 'center',
          alignItems: 'center',
        }}>
          {
            <BarCodeScanner
              onBarCodeScanned={isScan ? onBarCodeScanned : null}
              style={{ width: wp("100%"), height: ("100%"), backgroundColor: "#eaeaea" }}
            />
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanScreen;
