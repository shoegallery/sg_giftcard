import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ForgetPasswordScreen,
  Dashboard,
  ResetPasswordScreen,
} from "./src/screens";
import { Text, TextInput } from "react-native";

import { StateProvider } from "./src/Context/StateContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, Box } from "native-base";

const Stack = createStackNavigator();

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <StateProvider>
          <Provider theme={theme}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="LoginScreen"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen
                  name="RegisterScreen"
                  component={RegisterScreen}
                />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen
                  name="ForgetPasswordScreen"
                  component={ForgetPasswordScreen}
                />
                <Stack.Screen
                  name="ResetPasswordScreen"
                  component={ResetPasswordScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Provider>
        </StateProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
