import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, Modal, Image } from "react-native";
import Icon, { FA5Style } from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { API } from "../API/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [kosong, setkosong] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    const closeModal = () => {
        setkosong(false);
    }
    const btnLogin = async () => {
        let currentErrors = {};

        if (!email) {
            currentErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            currentErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            currentErrors.password = 'Password is required';
        } else if (password.length < 8) {
            currentErrors.password = 'Password must be at least 8 characters long';
        }

        setErrors(currentErrors);
        if (Object.keys(currentErrors).length === 0) {
            const data = {
                email: email,
                password: password,
            };
            try {
                const response = await Axios.post(`${API}/api/login`, data);
                const { id, name, username, email, tanggal_registrasi, token } = response.data.data || {};

                if (id) {
                    await AsyncStorage.setItem('id', id.toString());
                    await AsyncStorage.setItem('name', name);
                    await AsyncStorage.setItem('username', username);
                    await AsyncStorage.setItem('email', email);
                    await AsyncStorage.setItem('tanggal_registrasi', tanggal_registrasi);
                    await AsyncStorage.setItem('token', token);
                    setEmail("");
                    setPassword("");
                    navigation.navigate("HomeUser");
                    console.log("Login berhasil");
                } else {
                    Alert.alert("Peringatan", "ID tidak ditemukan");
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    const message = error.response.data.message;
                    setkosong(true);
                    return false;
                } else {
                    Alert.alert("Peringatan", "terjadi kesalahan");
                }
                console.error("Error detaisssl:", error);
            }
        }
    };


    return (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ elevation: 10, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
                <View style={{ marginTop: '12%', marginLeft: '7%', marginBottom: '3%' }}>
                    <Text style={{ fontSize: 34, color: '#fff', fontFamily: 'Poppins-Bold' }}>Welcome Back,</Text>
                    <Text style={{ fontSize: 34, color: '#fff', fontWeight: 'bold', fontFamily: 'Poppins-Bold' }}>Log In!</Text>
                </View>
            </LinearGradient>
            <ScrollView style={{ marginTop: '26%' }}>
                <View style={{ marginHorizontal: '5%' }}>
                    <Fumi
                        keyboardType="email-address"
                        value={email}
                        label={'EMAIL ADDRESS'}
                        iconClass={FontAwesomeIcon}
                        iconName={'envelope'}
                        iconColor={'#2F5095'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={{ borderRadius: 20, borderColor: errors.email ? 'red' : '#000', borderWidth: 1 }}
                        onChangeText={text => { setEmail(text); setErrors(prev => ({ ...prev, email: '' })); }}
                    />
                    {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                    <View style={{ marginTop: 30 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Fumi
                            label={'PASSWORD'}
                            iconClass={FontAwesomeIcon}
                            iconName={'lock'}
                            iconColor={'#2F5095'}
                            iconSize={25}
                            iconWidth={40}
                            value={password}
                            style={{ flex: 1, borderRadius: 20, borderColor: errors.password ? 'red' : '#000', borderWidth: 1 }}
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={text => { setPassword(text); setErrors(prev => ({ ...prev, password: '' })); }}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'absolute', right: '6%' }}>
                            <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#2F5095" />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                    <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: '20%' }}>
                        <Text style={{ color: '#000', fontSize: 20 }}>Belum memiliki akun?</Text>
                        <View style={{ marginRight: 5 }} />
                        <TouchableOpacity onPress={() => navigation.navigate('Registrasi')}>
                            <Text style={{ color: '#2F5095', fontSize: 20, fontWeight: 'bold' }}>Registrasi</Text>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ padding: 15, borderRadius: 50, marginHorizontal: '5%', marginTop: 10 }}>
                        <TouchableOpacity onPress={btnLogin}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 20 }}>LOG IN</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>
            <Modal visible={kosong} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={closeModal}>
                            <Text style={{ color: '#272727', fontSize: 18 }}>x</Text>
                        </TouchableOpacity>
                        <Image source={require('../img/warning.png')} style={{ width: 165, height: 150 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 16, color: '#272727', textAlign: 'center' }}>
                            Email atau Password salah, coba lagi ⚠️
                        </Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 330, borderRadius: 9, elevation: 2 }} onPress={closeModal}>
                            <Text style={{ color: '#FFFFFF' }}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Login;