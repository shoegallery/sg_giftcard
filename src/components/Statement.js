import React, { useState, useEffect, useContext } from "react";
import { StateContextHistory } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text, Box, FlatList, HStack, Spacer, VStack, View } from "native-base";

export default function Statement() {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);
  return (
    <View>
      <FlatList
        data={userTransactionData}
        alignSelf="center"
        height={hp("40%")}
        width={wp("95%")}
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            pl="4"
            pr="5"
            py="2"
          >
            <HStack space={3} height={16} justifyContent="space-between">
              <VStack justifyContent="center" width="75%" backgroundColor="red">
                <Text fontSize={16} color="coolGray.800" bold>
                  {item.trnxType}
                </Text>
                <Text
                  fontSize={10}
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  {item.summary}
                </Text>

                <Text fontSize={10} color="coolGray.800" bold>
                  {item.createdAt}
                </Text>
              </VStack>
              <Spacer />
              <Text
                paddingRight={100}
                bold
                alignSelf="center"
                fontSize="md"
                color="coolGray.800"
              >
                {item.amount.$numberDecimal}
              </Text>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
