import { StatusBar, View, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import Login from "./src/screens/Login";
import Registrasi from "./src/screens/Registrasi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeUser from "./src/screens/HomeUser";
import TambahPengaduan from "./src/screens/TambahPengaduan";
import PengaduanSaya from "./src/screens/PengaduanSaya";
import Explorasi from "./src/screens/Explorasi";
import AkunSaya from "./src/screens/AkunSaya";
import GetStarted from "./src/screens/GetStarted";
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle='dark-content' />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 3, marginTop: '30%' }}>
          <Image source={require("./src/img/gambar2.png")} style={{ width: 190, height: 190 }} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000' }}>Pengaduan 17</Text>
        </View>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "HomeUser" : "GetStarted"}>
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Registrasi" component={Registrasi} options={{ headerShown: false }} />
        <Stack.Screen name="HomeUser" component={HomeUser} options={{ headerShown: false }} />
        <Stack.Screen name="TambahPengaduan" component={TambahPengaduan} options={{ headerShown: false }} />
        <Stack.Screen name="PengaduanSaya" component={PengaduanSaya} options={{ headerShown: false }} />
        <Stack.Screen name="Explorasi" component={Explorasi} options={{ headerShown: false }} />
        <Stack.Screen name="AkunSaya" component={AkunSaya} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;