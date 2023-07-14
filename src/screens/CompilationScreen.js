import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  UIManager,
} from "react-native";

import { Text } from "native-base";

const { width, height } = Dimensions.get("window");

const CompilationScreen = ({ navigation }) => {
  const axios = require("axios");
  let data = JSON.stringify({
    phone: 86218722,
    walletSuperId:
      "Wc5jJfFx1pEGpM8VQu2rnyt7CxzJLooQsTYcq7l7ZmgkYRcGI9s7E6701ZzfUCWp",
    color: "red",
    interest: "all",
    gender: "male",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://192.168.1.2:8080/api/v1/wallets/info",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjE4ZWY4NDYzMDNhYjQxNjEzNjI1YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5MzU5MjI5LCJleHAiOjE2ODkzNjY0Mjl9.dDtx62AfsRw4YrG9FTO0U7x1wtIknBHBKf8I06Wn214",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count

    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>CompilationScreen</Text>
    </View>
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

export default CompilationScreen;
