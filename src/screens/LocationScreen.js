import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  UIManager,
  TouchableHighlight,
  Linking,
  Platform,
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
} from "@expo/vector-icons";
import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Icon,
} from "native-base";
import BackButton from "../components/BackButton";
const { width, height } = Dimensions.get("window");

const LocationScreen = ({ navigation }) => {
  const data = [
    {
      id: "2",
      name: "BASCONI - УБИД",
      address:
        "СБД, 4 хороо, Энхтайваны өргөн чөлөө-57, Улаанбаатар Их Дэлгүүрийн 5 давхарт BASCONI",
      time1: "Да-Пү,Ня   10:00-21:00",
      time2: "Ба-Бя   10:00-22:00",
      avatarUrl:
        "https://scontent.fuln1-2.fna.fbcdn.net/v/t39.30808-6/259394130_4601549603262560_1389752959198202404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a26aad&_nc_ohc=cOYQBvh4sAYAX9dG3Ed&_nc_ht=scontent.fuln1-2.fna&oh=00_AfDlIibHaGT9OXpAQqNzycVuTWtcX1ddWlAiO_v_AWmWbg&oe=63FE2AB6",
    },
    {
      id: "3",
      name: "Sasha Fabiani - УБИД",
      address:
        "СБД, 4 хороо, Энхтайваны өргөн чөлөө-57, Улаанбаатар Их Дэлгүүрийн 5 давхарт Sasha Fabiani",
      time1: "Да-Пү,Ня   10:00-21:00",
      time2: "Ба-Бя   10:00-22:00",
      avatarUrl:
        "https://scontent.fuln1-2.fna.fbcdn.net/v/t39.30808-6/259394130_4601549603262560_1389752959198202404_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a26aad&_nc_ohc=cOYQBvh4sAYAX9dG3Ed&_nc_ht=scontent.fuln1-2.fna&oh=00_AfDlIibHaGT9OXpAQqNzycVuTWtcX1ddWlAiO_v_AWmWbg&oe=63FE2AB6",
    },

    {
      id: "5",
      name: "BASCONI - Максмоол",
      address:
        "БГД, Баруун 4 зам, Максмоол худалдааны төвийн 2 давхарт                       BASCONI",
      time1: "Да-Ня   10:00-21:00",
      time2: "",
      avatarUrl: "https://cdnp.cody.mn/dep_stores/6/original/max_mall_1.jpg",
    },
    {
      id: "6",
      name: "Sasha Fabiani - Максмоол",
      address:
        "БГД, Баруун 4 зам, Максмоол худалдааны төвийн 2 давхарт                       Sasha Fabiani",
      time1: "Да-Ня   10:00-21:00",
      time2: "",
      avatarUrl: "https://cdnp.cody.mn/dep_stores/6/original/max_mall_1.jpg",
    },
    {
      id: "7",
      name: "Shoe Gallery - Гранд Плаза",
      address:
        "БГД, Баруун 4 зам, Гранд Плаза худалдааны төвийн 3 давхарт                                 326, Shoe Gallery ",
      time1: "Да-Ня   10:00-21:00",
      time2: "",
      avatarUrl:
        "https://twovegetariansinmongolia.files.wordpress.com/2019/03/grand-plaza.jpg",
    },
    {
      id: "8",
      name: "Shoe Gallery - Хүннүмоол",
      address:
        "ХУД, 4-р хороо , Хүннү Молл худалдааны төвийн B1 давхарт                      Shoe Gallery",
      time1: "Да-Ня   11:00-22:00",
      time2: "",
      avatarUrl:
        "https://cdnp.cody.mn/dep_stores/5/original/hunnu_mall_new87946531.jpg",
    },
  ];
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          style={{ backgroundColor: "white" }}
          goBack={navigation.goBack}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ width: 60 }}
          onPress={() => {
            if (Platform.OS === "android") {
              Linking.openURL(`tel:${80409000}`);
            } else {
              Linking.openURL(`telprompt:${80409000}`);
            }
          }}
        >
          <HStack
            height={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Icon as={AntDesign} size="xl" name="phone" color="green.500" />
          </HStack>
        </TouchableOpacity>
      ),
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <Box
      backgroundColor={"#ececec"}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
    >
      <Box backgroundColor={"#ececec"} paddingBottom={"8"}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View>
              <TouchableHighlight
                underlayColor="#e0e0e0"
                onPress={() => {
                  console.log("first");
                }}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#9e9e9e",
                  paddingTop: 5,
                  paddingBottom: 5,
                  justifyContent: "center",
                }}
              >
                <Box>
                  <HStack justifyContent="space-between">
                    <Box
                      width={"20%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.avatarUrl,
                        }}
                      />
                    </Box>
                    <VStack justifyContent={"center"} width={"60%"}>
                      <Text
                        _dark={{
                          color: "warmGray.50",
                        }}
                        color="coolGray.800"
                        bold
                      >
                        {item.name}
                      </Text>
                      <Box>
                        <Text
                          fontSize={"xs"}
                          color="coolGray.600"
                          _dark={{
                            color: "warmGray.200",
                          }}
                        >
                          {item.address}
                        </Text>
                      </Box>
                    </VStack>
                    <Box justifyContent={"center"} width={"20%"}>
                      <Box>
                        <Text
                          fontSize={"xs"}
                          color="coolGray.800"
                          _dark={{
                            color: "warmGray.200",
                          }}
                        >
                          {item.time1}
                        </Text>
                        {item.time2 != "" ? (
                          <Text
                            fontSize={"xs"}
                            color="coolGray.800"
                            _dark={{
                              color: "warmGray.200",
                            }}
                          >
                            {item.time2}
                          </Text>
                        ) : (
                          <View></View>
                        )}
                      </Box>
                    </Box>
                  </HStack>
                </Box>
              </TouchableHighlight>
              <Spacer />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
    </Box>
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

export default LocationScreen;
