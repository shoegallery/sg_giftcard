import React, { useCallback } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  LoginScreen,
  RegisterScreen,
  ForgetPasswordScreen,

  Dashboard,
  MainScreen,
} from "./src/screens";
import { Text, TextInput, LogBox } from "react-native";
import { SSRProvider } from "@react-aria/ssr";

import { StateProvider, StateContextHistory } from "./src/Context/StateContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, ToastProvider } from "native-base";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
]);
const Stack = createStackNavigator();




if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
export default function App() {
  const [fontsLoaded] = useFonts({
    bold: require("./src/assets/font/SamsungSans-Bold.ttf"),
    regular: require("./src/assets/font/SamsungSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SSRProvider>
      <NativeBaseProvider>
        <ToastProvider>
          <SafeAreaProvider>
            <StateProvider>
              <Provider>
                <NavigationContainer >
                  <Stack.Navigator
                    initialRouteName="MainScreen"
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen name="MainScreen" component={MainScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />


                    <Stack.Screen
                      name="RegisterScreen"
                      component={RegisterScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </Provider>
            </StateProvider>
          </SafeAreaProvider>
        </ToastProvider>
      </NativeBaseProvider>
    </SSRProvider>
  );
}