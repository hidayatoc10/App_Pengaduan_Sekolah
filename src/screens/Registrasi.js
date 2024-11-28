import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Alert, Modal, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { API } from "../API/api";

const Registrasi = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [modalsukses, setmodalsukses] = useState(false);
    const [username, setUsername] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [kosong, setkosong] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const closeModal = () => {
        setkosong(false);
    }
    const btnRegistras = () => {
        let currentErrors = {};

        if (!name) {
            currentErrors.name = 'Name is required';
        } else if (name.length < 3 || name.length > 50) {
            currentErrors.name = 'Name must be between 3 and 50 characters';
        }

        if (!username) {
            currentErrors.username = 'Username is required';
        } else if (username.length < 3 || username.length > 50) {
            currentErrors.username = 'Username must be between 3 and 50 characters';
        }

        if (!email) {
            currentErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            currentErrors.email = 'Enter a valid email (e.g., name@gmail.com)';
        }

        if (!password) {
            currentErrors.password = 'Password is required';
        } else if (password.length < 8 || password.length > 100) {
            currentErrors.password = 'Password must be between 8 and 100 characters';
        }

        setErrors(currentErrors);

        if (Object.keys(currentErrors).length === 0) {
            const dataInput = { name, username, email, password };

            Axios.post(`${API}/api/registrasi`, dataInput)
                .then((ress) => {
                    setmodalsukses(true);
                    setName("");
                    setEmail("");
                    setUsername("");
                    setPassword("");
                    console.log(ress);
                }).catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        const message = error.response.data.message;
                        if (message.includes("Registrasi gagal, coba lagi")) {
                            Alert.alert("Peringatan", "Registrasi gagal, coba lagi");
                        } else {
                            Alert.alert('Peringatan', message);
                        }
                    } else {
                        Alert.alert("Peringatan", "terjadi kesalahan");
                    }
                });
        }
    };

    return (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ elevation: 10, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
                <View style={{ marginTop: '12%', marginBottom: '3%', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: '8%' }}>
                    <Text style={{ fontSize: 34, color: '#fff', fontFamily: 'Poppins-Bold' }}>Welcome</Text>
                    <Text style={{ fontSize: 34, color: '#fff', fontWeight: 'bold', fontFamily: 'Poppins-Bold' }}>Registrasi!</Text>
                </View>
            </LinearGradient>
            <ScrollView style={{ marginTop: '18%' }}>
                <View style={{ marginHorizontal: '5%' }}>
                    <Fumi
                        value={name}
                        label={'NAME'}
                        iconClass={FontAwesomeIcon}
                        iconName={'user'}
                        iconColor={'#2F5095'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={[{ borderRadius: 20, borderColor: errors.name ? 'red' : '#000', borderWidth: 1 }]}
                        onChangeText={text => { setName(text); setErrors(prev => ({ ...prev, name: '' })); }}
                    />
                    {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                    <View style={{ marginTop: 25 }} />
                    <Fumi
                        value={username}
                        label={'USERNAME'}
                        iconClass={FontAwesomeIcon}
                        iconName={'address-card'}
                        iconColor={'#2F5095'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={[{ borderRadius: 20, borderColor: errors.username ? 'red' : '#000', borderWidth: 1 }]}
                        onChangeText={text => { setUsername(text); setErrors(prev => ({ ...prev, username: '' })); }}
                    />
                    {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}
                    <View style={{ marginTop: 25 }} />
                    <Fumi
                        value={email}
                        label={'EMAIL ADDRESS'}
                        iconClass={FontAwesomeIcon}
                        iconName={'envelope'}
                        iconColor={'#2F5095'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={[{ borderRadius: 20, borderColor: errors.email ? 'red' : '#000', borderWidth: 1 }]}
                        onChangeText={text => { setEmail(text); setErrors(prev => ({ ...prev, email: '' })); }}
                    />
                    {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                    <View style={{ marginTop: 25 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Fumi
                            label={'PASSWORD'}
                            iconClass={FontAwesomeIcon}
                            iconName={'lock'}
                            iconColor={'#2F5095'}
                            iconSize={25}
                            iconWidth={40}
                            value={password}
                            style={[{ flex: 1, borderRadius: 20, borderColor: errors.password ? 'red' : '#000', borderWidth: 1 }]}
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={text => { setPassword(text); setErrors(prev => ({ ...prev, password: '' })); }}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'absolute', right: '6%' }}>
                            <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#2F5095" />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                    <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: '20%' }}>
                        <Text style={{ color: '#000', fontSize: 20 }}>Sudah memiliki akun?</Text>
                        <View style={{ marginRight: 5 }} />
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: '#2F5095', fontSize: 20, fontWeight: 'bold' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3182AD', '#2F5095']} style={{ padding: 15, borderRadius: 50, marginHorizontal: '5%', marginTop: 10 }}>
                        <TouchableOpacity onPress={btnRegistras}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 20 }}>REGISTRASI</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>
            <Modal visible={modalsukses} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: '#272727', fontSize: 18 }}>x</Text>
                        </TouchableOpacity>
                        <Image source={require('../img/berhasil.png')} style={{ width: 150, height: 150 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 16, color: '#272727', textAlign: 'center' }}>
                            Registrasi Berhasil, Silahkan Login
                        </Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 330, borderRadius: 9, elevation: 2 }} onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: '#FFFFFF' }}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Registrasi;