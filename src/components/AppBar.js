import React from "react";
import {
  VStack,
  HStack,
  Button,
  IconButton,
  Icon,
  Text,
  NativeBaseProvider,
  Center,
  Box,
  StatusBar,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const AppBar = () => {
  return (
    <>
      <Box safeAreaTop bg="violet.600" width={"100%"}  />
      <HStack
        bg="violet.800"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        maxW="350"
      >
        <HStack alignItems="center">
          <IconButton
            icon={
              <Icon size="sm" as={MaterialIcons} name="menu" color="white" />
            }
          />
          <Text color="white" fontSize="20" fontWeight="bold">
            Home
          </Text>
        </HStack>
        <HStack>
        </HStack>
      </HStack>
    </>
  );
};

export default AppBar;
