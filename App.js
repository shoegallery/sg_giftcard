import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import {
  LoginScreen,
  RegisterScreen,
  ForgetPasswordScreen,
  Dashboard,
} from "./src/screens";
import { Text, TextInput, LogBox } from "react-native";
import { SSRProvider } from "@react-aria/ssr";

import { StateProvider, StateContextHistory } from "./src/Context/StateContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, ToastProvider } from "native-base";
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
  return (
    <SSRProvider>

      <NativeBaseProvider>

        <ToastProvider>
          <SafeAreaProvider>

            <StateProvider>
              <Provider>

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

                  </Stack.Navigator>

                </NavigationContainer>

              </Provider>
            </StateProvider>

          </SafeAreaProvider>
        </ToastProvider>

      </NativeBaseProvider>

    </SSRProvider >
  );
}
