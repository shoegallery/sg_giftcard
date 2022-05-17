import React, { useState, useEffect, useContext } from "react";
import { StateContextHistory } from "../Context/StateContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native";
import {
  Text,
  Box,
  FlatList,
  HStack,
  Spacer,
  VStack,
  View,
  Modal,
  ScrollView,
  Button,
  Center,
} from "native-base";
import moment from "moment";

export default function Statement() {
  const [userTransactionData, setUserTransactionData] =
    useContext(StateContextHistory);

  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View>
      <Modal onClose={setModalVisible} size={50}>
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Худалдан авалтын дэлгэрэнгүй</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <FlatList
                keyExtractor={(item) => item._id}
                data={userTransactionData}
                alignSelf="center"
                height={hp("40%")}
                width={wp("90%")}
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
                    <HStack
                      space={3}
                      height={16}
                      justifyContent="space-between"
                    >
                      <VStack
                        justifyContent="center"
                        width="100%"
                        backgroundColor="red"
                      >
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
                          {moment(item.createdAt).format("YYYY-MM-DD")}
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
              />
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}
