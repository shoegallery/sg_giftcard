import React from "react";
import {
  Box,
  useDisclose,
  IconButton,
  Stagger,
  HStack,
  Icon,
  Center,
  NativeBaseProvider,
  Text,
} from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";

const MyActionButtonComponent = (props) => {
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
            mb="4"
            variant="solid"
            bg="#40c4ff"
            colorScheme="blue"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialIcons}
                size={wp("10%")}
                name="location-pin"
                _dark={{
                  color: "white",
                }}
                color="white"
              />
            }
          />

          <IconButton
            mb="4"
            variant="solid"
            bg="#FF6666"
            colorScheme="red"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: "white",
                }}
                size={wp("10%")}
                name="shopping"
                color="white"
                onPress={() => {
                  WebBrowser.openBrowserAsync("https://shoegallery.mn");
                }}
              />
            }
          />
          <IconButton
            mb="4"
            variant="solid"
            bg="#00c853"
            colorScheme="teal"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size={wp("10%")}
                name="phone"
                color="white"
                onPress={() => {
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
            mb="4"
            variant="solid"
            backgroundColor="#607d8b"
            colorScheme="black"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size={wp("10%")}
                name="logout"
                color="white"
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
          variant="solid"
          borderRadius="full"
          size="lg"
          onPress={onToggle}
          bg="#03a9f4"
          icon={
            <Icon
              as={MaterialCommunityIcons}
              size={wp("10%")}
              name="dots-horizontal"
              color="white"
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
