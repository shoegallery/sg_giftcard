import React, { useState } from "react";
import {
  Box,
  useDisclose,
  IconButton,
  Stagger,
  HStack,
  Icon,
  Modal,
  Button,
  VStack,
  Spacer,
  Text,
} from "native-base";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

import { View, Linking, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";

const StoreAddress = () => {
  const storeData = [
    {
      name: "Хан-Уул Имарт - Shoe Gallery",
      location: "ХУД, 15 хороо, Имарт Хан-Уул салбар, 1 давхарт Shoe Gallery",
      googlemap: "",
      maps: "",
    },
    {
      name: "Гранд Плаза - Shoe Gallery",
      location: "БГД, 2 хороо, Гранд плаза 3 давхарт 326, Shoe Gallery",
      googlemap: "",
      maps: "",
    },
    {
      name: "Хүннү-молл - Shoe Gallery",
      location: "ХУД, 4 хороо, Хүннү молл B1 давхарт Shoe Gallery",
      googlemap: "",
      maps: "",
    },
    {
      name: "УБИД - BASCONI",
      location: "СБД, 4 хороо, Улаанбаатар их дэлгүүр, 5 давхарт BASCONI",
      googlemap: "",
      maps: "",
    },
    {
      name: "УБИД - Bugatti",
      location: "СБД, 4 хороо, Улаанбаатар их дэлгүүр, 5 давхарт Bugatti",
      googlemap: "",
      maps: "",
    },
    {
      name: "УБИД - Sasha Fabiani",
      location: "СБД, 4 хороо, Улаанбаатар их дэлгүүр, 5 давхарт Sasha Fabiani",
      googlemap: "",
      maps: "",
    },

    {
      name: "Максмолл - BASCONI",
      location: "БГД, 16 хороо, Максмолл худалдааны төв, 2 давхарт BASCONI",
      googlemap: "",
      maps: "",
    },
    {
      name: "Максмолл - Shoe Gallery",
      location: "БГД, 16 хороо, Максмолл худалдааны төв, 2 давхарт Shoe Gallery",
      googlemap: "",
      maps: "",
    },
    {
      name: "Максмолл - Sasha Fabiani",
      location: "БГД, 16 хороо, Максмолл худалдааны төв, 2 давхарт Sasha Fabiani",
      googlemap: "",
      maps: "",
    },

  ];

  return (
    <Box>
      <SafeAreaView>
        <ScrollView>
          <View>
            {storeData.map((item, index) => (
              <Box
                alignItems="center"
                justifyContent="center"
                width={"100%"}
                key={index}
                borderBottomWidth="2"
                _dark={{
                  borderColor: "gray.600",
                }}
                borderColor="gray.300"
              >
                <HStack height={90} justifyContent="center">
                  <VStack alignItems="center" justifyContent="center" width="100%">
                    <Text
                      alignSelf="auto"
                      width={"90%"}
                      minW={"90%"}
                      flexWrap="wrap"
                      fontSize={16}
                      color="coolGray.800"
                      bold

                    >
                      {item.name}
                    </Text>
                    <Text
                      alignSelf="auto"
                      width={"90%"}
                      minW={"90%"}
                      semibold
                      flexWrap="wrap"
                      justifyContent="space-evenly"


                      fontSize={14}
                      color="coolGray.600"
                      _dark={{
                        color: "warmGray.200",
                      }}
                    >
                      {item.location}
                    </Text>
                  </VStack>
                  <Spacer />
                </HStack>
              </Box>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};
const MyActionButtonComponent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isOpen, onToggle } = useDisclose();
  return (
    <View
      style={{
        marginLeft: wp("80%"),
        marginTop: hp("-40%"),
        height: hp("43%"),
      }}
    >
      <Box height="full">
        <Stagger
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
            translateY: 34,
          }}
          animate={{
            translateY: 0,
            scale: 1,
            opacity: 1,
            transition: {
              type: "spring",
              mass: 0.8,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
          exit={{
            translateY: 34,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 100,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
        >
          <IconButton
            shadow={5}
            mb="4"
            variant="solid"
            bg="#ffffff"
            colorScheme="orange"
            borderRadius="full"
            borderWidth={3}
            borderColor="#CC5801"
            icon={
              <Icon
                as={Entypo}
                size={wp("10%") - 6}
                name="location"
                _dark={{
                  color: "white",
                }}
                color="#CC5801"
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            }
          />
          <View
            style={{
              width: wp("90%"),
              height: hp("80%"),
              position: "absolute",
            }}
          >
            {modalVisible ? (
              <Modal
                alignItems="center"
                justifyContent="center"
                size="xl"
                isOpen={modalVisible}
                onClose={setModalVisible}
                width={"100%"}
              >
                <Modal.Content height={"90%"}>
                  <Modal.Header textAlign="center">
                    Дэлгүүрийн хаяг
                  </Modal.Header>
                  <Modal.Body height="full">
                    {modalVisible ? <StoreAddress /> : <View></View>}
                  </Modal.Body>

                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        onPress={() => {
                          setModalVisible(false);
                        }}
                      >
                        Болсон
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            ) : (
              <View></View>
            )}
          </View>
          <IconButton
            shadow={5}
            mb="4"
            variant="solid"
            bg="#ffffff"
            colorScheme="orange"
            borderWidth={3}
            borderColor="#CC5801"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: "white",
                }}
                size={wp("10%") - 6}
                name="shopping-outline"
                color="#CC5801"
                onPress={() => {
                  onToggle;
                  WebBrowser.openBrowserAsync("https://shoegallery.mn");
                }}
              />
            }
          />
          <IconButton
            shadow={5}
            mb="4"
            variant="solid"
            bg="#ffffff"
            borderWidth={3}
            borderColor="#CC5801"
            colorScheme="orange"
            borderRadius="full"
            icon={
              <Icon
                as={Feather}
                size={wp("10%") - 6}
                name="phone"
                color="#CC5801"
                onPress={() => {
                  onToggle;
                  if (Platform.OS === "android") {
                    Linking.openURL(`tel:${80409000}`);
                  } else {
                    Linking.openURL(`telprompt:${80409000}`);
                  }
                }}
              />
            }
          />

          <IconButton
            shadow={5}
            mb="4"
            variant="solid"
            borderWidth={3}
            borderColor="#CC5801"
            backgroundColor="#ffffff"
            colorScheme="orange"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size={wp("10%") - 6}
                name="exit-to-app"
                color="#CC5801"
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                  });
                }}
                _dark={{
                  color: "white",
                }}
              />
            }
          />
        </Stagger>
      </Box>
      <HStack alignItems="center">
        <IconButton
          shadow={5}
          variant="solid"
          borderRadius="full"
          borderWidth={3}
          borderColor="#CC5801"
          colorScheme="orange"
          size="lg"
          onPress={onToggle}
          bg="#ffffff"
          icon={
            <Icon
              as={Ionicons}
              size={wp("10%") - 6}
              name="ios-menu"
              color="#CC5801"
              _dark={{
                color: "white",
              }}
            />
          }
        />
      </HStack>
    </View>
  );
};

export default MyActionButtonComponent;
