import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, StatusBar, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

const GetStarted = () => {
    const navigation = useNavigation();
    return (
        <View style={{ backgroundColor: '#DCE6F0', flex: 1 }}>
            <StatusBar backgroundColor='#DCE6F0' barStyle='dark-content' />
            <Image source={require('../img/gambar1.jpg')} style={{ height: '55%', width: '100%' }} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, color: '#0D47A1', fontWeight: 'bold', textAlign: 'center' }}>Selamat Datang Aplikasi</Text>
                <Text style={{ fontSize: 30, color: '#0D47A1', fontWeight: 'bold', textAlign: 'center' }}>Pengaduan Siswa</Text>
                <Text style={{ fontSize: 30, color: '#0D47A1', fontWeight: 'bold', textAlign: 'center' }}>SMK NEGERI 17 </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ backgroundColor: '#0D47A1', padding: 20, marginHorizontal: 15, borderRadius: 20, marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>GET STARTED</Text>
            </TouchableOpacity>
        </View>
    );
}

export default GetStarted;