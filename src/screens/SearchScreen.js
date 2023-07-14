import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  UIManager,
  Platform,
} from "react-native";
import BackButton from "../components/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Modal,
  Text,
  NativeBaseProvider,
  FormControl,
  Input,
  Box,
  VStack,
  Heading,
  useToast,
  Icon,
  Select,
  Center,
  HStack,
} from "native-base";
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
  Ionicons,
  Foundation,
} from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    setSearchText("");
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Box backgroundColor={"white"} shadow={"3"} height={"16"}>
          <Box paddingTop={2} alignItems={"center"}>
            <Center>
              <HStack>
                <Input
                  borderRadius={"sm"}
                  backgroundColor={"#ececec"}
                  isFocused={false}
                  variant={"unstyled"}
                  w={{
                    base: "94%",
                  }}
                  h={{ base: "12" }}
                  fontSize="sm"
                  returnKeyType="done"
                  onChangeText={(text) => setSearchText(text)}
                  InputLeftElement={
                    <Box
                      height={"100%"}
                      width={"15%"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (searchText.length > 0) {
                
                          }
                        }}
                      >
                        <Box>
                          <Icon
                            width={"15%"}
                            as={<MaterialIcons name="search" size={"md"} />}
                            size={"lg"}
                            color="black"
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  }
                  placeholder="Энд хайх зүйлээ бичээрэй"
                />
              </HStack>
            </Center>
          </Box>
        </Box>
      ),
    });

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);

  return (
    <SafeAreaView style={{ height: "100%", width: "100%" }}>
      <StatusBar barStyle="dark-content" backgroundColor="red" />

      <Box backgroundColor={"white"} shadow={"3"} height={"16"}>
        <Box paddingTop={2} alignItems={"center"}>
          <Center>
            <HStack>
              <Input
                borderRadius={"sm"}
                backgroundColor={"#ececec"}
                isFocused={false}
                variant={"unstyled"}
                w={{
                  base: "94%",
                }}
                h={{ base: "12" }}
                fontSize="sm"
                returnKeyType="done"
                onChangeText={(text) => setSearchText(text)}
                InputLeftElement={
                    <Box
                      height={"100%"}
                      width={"15%"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (searchText.length > 0) {
                            console.log("HE");
                          }
                        }}
                      >
                        <Box searchText>

                        

                          <Icon
                            width={"15%"}
                            as={<MaterialIcons name="search" size={"md"} />}
                            size={"lg"}
                            color="black"
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  }
                placeholder="Энд хайх зүйлээ бичээрэй"
              />
            </HStack>
          </Center>
        </Box>
      </Box>
      <Text>sss</Text>
    </SafeAreaView>
  );
};

export default SearchScreen;
