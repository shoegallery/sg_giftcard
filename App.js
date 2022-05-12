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
import { StateProvider } from "./src/Context/StateContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export default function App() {
  return (
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
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
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
  );
}
