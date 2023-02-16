import React from "react";

import { IconButton, Icon, View } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function BackButton({ goBack }) {
  return (
    <IconButton onPress={goBack} size={"lg"} variant="solid" backgroundColor={"#ececec"} _icon={{
      as: AntDesign,
      name: "arrowleft",
      color: "black"
    }} />

  );
}
