import React, { useCallback, useState, useEffect, useRef } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  LoginScreen,
  RegisterScreen,
  ForgetPasswordScreen,
  LoginAuthScreen,
  Dashboard,
  MainScreen,
} from "./src/screens";
import { Text, TextInput, LogBox, StatusBar, Alert, Linking } from "react-native";
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
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


async function registerForPushNotificationsAsync() {

  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    console.log(existingStatus)
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Та мэдэгдэл хүлээн авах уу',
        'My Alert Msg',
        [
          {
            text: 'Cancel',
            onPress: () => Linking.openSettings(),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        },
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    console.log(finalStatus)
  } else {
    alert('Бодит утас ашиглана уу ;)');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;


}

const Stack = createStackNavigator();




if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    console.log(expoPushToken)
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <NavigationContainer >
                  <Stack.Navigator
                    initialRouteName="LoginScreen"
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="LoginAuthScreen" component={LoginAuthScreen} />
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