import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StatusBar, Modal, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const HomeUser = () => {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [greeting, setGreeting] = useState('');
    const [logoutt, setlogoutt] = useState(false);

    const logouttt = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('tanggal_registrasi');
        await AsyncStorage.removeItem('id');
        navigation.replace('Login');
    };
    const logout = () => {
        setlogoutt(true);
    };
    const closeModal = () => {
        setlogoutt(false);
    }
    const setGreetingMessage = () => {
        const now = new Date();
        const hours = now.getHours();
        if (hours >= 5 && hours < 12) {
            setGreeting('Selamat Pagi');
        } else if (hours >= 12 && hours < 15) {
            setGreeting('Selamat Siang');
        } else if (hours >= 15 && hours < 18) {
            setGreeting('Selamat Sore');
        } else {
            setGreeting('Selamat Malam');
        }
    };

    const cekData = async () => {
        const name = await AsyncStorage.getItem("name");
        setName(name);
    };
    useEffect(() => {
        setGreetingMessage();
        cekData();
    }, [])
    return (
        <View style={{ backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="transparent" barStyle='dark-content' />
            <View style={{ marginTop: 50 }} />
            <View style={{ marginLeft: 15, marginBottom: 15 }}>
                <Text style={{ color: '#2196F3', fontSize: 15, fontFamily: 'Poppins-Bold' }}>{greeting}</Text>
                <Text style={{ color: '#1565C0', fontSize: 20, fontFamily: 'Poppins-Bold' }}>{name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'baseline' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('PengaduanSaya')}
                    style={{ backgroundColor: '#1565C0', padding: 20, borderRadius: 10, elevation: 5 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17, fontFamily: 'Poppins-Bold' }}>Pengaduan Saya</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Explorasi')}
                    style={{ backgroundColor: '#2196F3', padding: 20, borderRadius: 10, elevation: 5 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17, fontFamily: 'Poppins-Bold' }}>Explor Pengaduan</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }} />
            <TouchableOpacity
                onPress={() => navigation.navigate('AkunSaya')}
                style={{ padding: 20, backgroundColor: '#64B5F6', borderRadius: 10, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                    <Icon name="user" size={25} color="#fff" />
                    <View style={{ marginLeft: 10 }} />
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 1, fontFamily: 'Poppins-Bold' }}>Akun Saya</Text>
                </View>
            </TouchableOpacity>
            <View style={{ marginTop: 20 }} />
            <TouchableOpacity
                onPress={logout}
                style={{ padding: 20, backgroundColor: '#F44336', borderRadius: 10, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                    <Iconn name="log-out-outline" size={25} color="#fff" />
                    <View style={{ marginLeft: 10 }} />
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 1, fontFamily: 'Poppins-Bold' }}>Logout</Text>
                </View>
            </TouchableOpacity>
            <Modal visible={logoutt} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={closeModal}>
                            <Text style={{ color: '#272727', fontSize: 18 }}>x</Text>
                        </TouchableOpacity>
                        <Image source={require('../img/warning.png')} style={{ width: 165, height: 150 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 16, color: '#272727', textAlign: 'center' }}>
                            Apakah Anda Ingin Logout? ⚠️
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 150, marginHorizontal: 10, borderRadius: 9, elevation: 2 }} onPress={logouttt}>
                                <Text style={{ color: '#FFFFFF' }}>Keluar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 150, marginHorizontal: 10, borderRadius: 9, elevation: 2 }} onPress={closeModal}>
                                <Text style={{ color: '#FFFFFF' }}>Tutup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        </View>
    );
}

export default HomeUser;