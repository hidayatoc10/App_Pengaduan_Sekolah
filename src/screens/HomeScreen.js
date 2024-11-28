import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ elevation: 10, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
                <View style={{ justifyContent: 'center', alignItems: "center", marginTop: "15%", }}>
                    <Image source={require("../img/ass.png")} />
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 30, marginTop: 10 }}>Pengaduan Sekolah</Text>
                </View>
            </LinearGradient>
            <View style={{ marginTop: "20%", justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: "#000", fontSize: 40, fontWeight: "bold" }}>
                    Sign Up
                </Text>
                <Text style={{ fontSize: 18 }}>
                    Sebelum masuk login dulu ya
                </Text>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ marginTop: "10%", justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                    <TouchableOpacity onPress={() => console.log("hallo")} style={{ paddingHorizontal: 50, paddingVertical: 15, flexDirection: 'row' }}>
                        <View style={{ marginRight: 10 }}>
                            <Icon name="facebook" size={25} color="#fff" />
                        </View>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: 'bold' }}>Continue with facebook</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <View style={{ marginTop: "10%" }}>
                    <Text style={{ fontSize: 18 }}>
                        facebook dan email
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: "10%" }}>
                    <Icon name="facebook" size={30} color="#1E88E5" style={{ marginRight: "10%", backgroundColor: '#000', padding: 10, borderRadius: 100, marginLeft: "10%", }} />
                    <Icon name="google" size={30} color="red" style={{ marginRight: "10%", backgroundColor: '#000', padding: 10, borderRadius: 100 }} />
                    <Icon name="envelope" size={30} color="orange" style={{ marginRight: "10%", backgroundColor: '#000', padding: 10, borderRadius: 100 }} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: '8%' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 8 }}>
                        Sudah memiliki akun?
                    </Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Login')
                    }}>
                        <Text style={{ color: "#2F5095", fontSize: 20, fontWeight: 'bold' }}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default HomeScreen;