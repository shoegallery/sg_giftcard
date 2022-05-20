import React from "react";

import { IconButton, Icon, View } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function BackButton({ goBack }) {
  return (
    <View
      style={{
        position: "relative",
        paddingTop: hp("1%"),
        alignSelf: "flex-start",
      }}
    >
      <IconButton
        mb="4"
        variant="solid"
        bg="white"
        colorScheme="blue"
        borderRadius="full"
        icon={
          <Icon
            as={Ionicons}
            _dark={{
              color: "white",
            }}
            size={wp("10%")}
            name="arrow-back"
            color="black"
            onPress={goBack}
          />
        }
      />
    </View>
  );
}
