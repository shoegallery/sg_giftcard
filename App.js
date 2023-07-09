import React, { useCallback, useState, useEffect, useRef, useContext } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome, Octicons
} from "@expo/vector-icons";
import {
  LoginScreen,
  ProfileScreen,
  ForgetPasswordScreen,
  LoginAuthScreen,
  Dashboard,
  LocationScreen,
  ExpenseScreen, TermScreen
} from "./src/screens";
import { Text, TextInput, LogBox, StatusBar, Alert, Linking, Button } from "react-native";
import { SSRProvider } from "@react-aria/ssr";
import BackButton from "./src/components/BackButton"
import { StateProvider, StateContextHistory } from "./src/Context/StateContext"; import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider, ToastProvider, IconButton } from "native-base";
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
export default function App({ navigation }) {

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
                      name="ProfileScreen"
                      component={ProfileScreen}

                    />
                    <Stack.Screen
                      options={{
                        headerShown: true,
                        title: 'Үйлчилгээний нөхцөл',
                        backgroundColor: "#ececec",
                        headerTintColor: '#ececec',
                        headerStyle: { backgroundColor: "white", borderRadius: 0 },
                        headerTitleStyle: {
                          width: "85%",
                          fontSize: 17,
                          color: "black",
                          fontWeight: "500",
                          backgroundColor: "white",
                          fontFamily: "regular",
                          textAlign: Platform.OS === "android" ? "center" : "auto"
                        },
                      }}
                      name="TermScreen"
                      component={TermScreen}
                    />
                    <Stack.Screen
                      options={{
                        headerShown: true,
                        title: 'Зарцуулах',
                        backgroundColor: "#ececec",
                        headerTintColor: '#ececec',
                        headerStyle: { backgroundColor: "#ececec", borderRadius: 0 },
                        headerTitleStyle: {
                          width: "80%",
                          fontSize: 20,
                          color: "black",
                          fontWeight: "500",
                          backgroundColor: "#ececec",
                          fontFamily: "regular",
                          textAlign: Platform.OS === "android" ? "center" : "auto"
                        },
                      }}
                      name="Зарцуулах"
                      component={ExpenseScreen}
                    />
                    <Stack.Screen
                      options={{
                        headerShown: true,
                        title: 'Дэлгүүрийн хаяг',
                        backgroundColor: "#ececec",
                        headerTintColor: '#ececec',
                        headerStyle: { backgroundColor: "white", borderRadius: 0 },
                        headerTitleStyle: {
                          width: "85%",
                          fontSize: 17,
                          color: "black",
                          fontWeight: "500",
                          fontFamily: "regular",
                          textAlign: Platform.OS === "android" ? "center" : "auto"
                        },
                      }}
                      name="LocationScreen"
                      component={LocationScreen}
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