import React, { useState } from 'react';
import { View, Button, Image, Alert, TextInput, Text, StyleSheet, Modal, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../API/api';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { Fumi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const TambahPengaduan = () => {
    const [imageUri, setImageUri] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [kategoriPengaduan, setKategoriPengaduan] = useState('');
    const navigation = useNavigation();
    const [kosong, setkosong] = useState(false);
    const [modalsukses, setmodalsukses] = useState(false);

    const badWords = ['bego', 'tolol', 'goblok', 'anjing', 'babi', 'tai', 'beloon', 'tololll'];
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Izin Akses Kamera",
                    message: "Aplikasi membutuhkan akses ke kamera untuk mengambil foto pengaduan.",
                    buttonNeutral: "Nanti",
                    buttonNegative: "Batal",
                    buttonPositive: "Izinkan",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };
    const closeModal = () => {
        setkosong(false);
        setmodalsukses(false);
    }
    const logout = () => {
        setlogoutt(true);
    };
    const validateInput = () => {
        const combinedText = `${title} ${description} ${kategoriPengaduan}`.toLowerCase();
        for (let word of badWords) {
            if (combinedText.includes(word)) {
                setkosong(true);
                setTitle("");
                setDescription("");
                setKategoriPengaduan("");
                setImageUri(null);
                return false;
            }
        }
        if (title.length < 4) {
            Alert.alert('Peringatan', 'Judul minimal 4 karakter');
            return false;
        }
        if (description.length < 10) {
            Alert.alert('Peringatan', 'Deskripsi minimal 10 karakter');
            return false;
        }
        if (kategoriPengaduan.length < 3) {
            Alert.alert('Peringatan', 'Kategori pengaduan minimal 3 karakter');
            return false;
        }
        return true;
    };

    const resizeImage = async (uri) => {
        try {
            const resizedImage = await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80);
            return resizedImage.uri;
        } catch (error) {
            console.log('Error resizing image:', error);
            return uri;
        }
    };

    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Peringatan', 'Izin kamera diperlukan untuk mengambil foto');
            return;
        }

        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                saveToPhotos: true,
            },
            async (response) => {
                if (response.didCancel) {
                    Alert.alert('Kamera dibatalkan');
                } else if (response.errorCode) {
                    console.log('Error: ' + response.errorMessage);
                } else {
                    const resizedUri = await resizeImage(response.assets[0].uri);
                    setImageUri(resizedUri);
                }
            }
        );
    };

    const createPengaduan = async () => {
        if (!validateInput()) return;

        if (!imageUri) {
            Alert.alert('Peringatan', 'Foto harus diunggah untuk mengajukan pengaduan');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('kategori_pengaduan', kategoriPengaduan);
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'pengaduan.jpeg',
        });

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(`${API}/api/add_pengaduan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.meta.code === 422) {
                Alert.alert('Error', response.data.meta.message);
            } else {
                Alert.alert('Berhasil', 'Pengaduan berhasil dikirim');
                setTitle('');
                setDescription('');
                setKategoriPengaduan('');
                setImageUri(null);
                navigation.goBack();
            }
        } catch (error) {
            console.log("Error:", error.response ? error.response.data : error.message);
            Alert.alert('Peringatan', 'Pastikan semua data pengaduan sudah terisi');
        }
    };


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#283593' barStyle='light-content' />
            <View style={{ backgroundColor: '#283593', padding: 20, elevation: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeUser')}>
                    <Icon name="arrow-left" size={20} color='#fff' />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: '#fff', marginLeft: 15 }}>Tambah Pengaduan</Text>
            </View>
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../img/homepage.png')} />
                    <Text style={{ color: '#283593', fontSize: 25, fontWeight: 'bold' }}>Form Pengaduan Sekolah</Text>
                </View>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <Fumi
                        label={'TITLE'}
                        iconClass={FontAwesomeIcon}
                        iconName={'tag'}
                        iconColor={'#283593'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={{ borderRadius: 10, borderColor: '#000', borderWidth: 1, flex: 1, marginHorizontal: 10 }}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Fumi
                        label={'KATEGORI'}
                        iconClass={FontAwesomeIcon}
                        iconName={'hashtag'}
                        iconColor={'#283593'}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        style={{ borderRadius: 10, borderColor: '#000', borderWidth: 1, flex: 1, marginRight: 10 }}
                        value={kategoriPengaduan}
                        onChangeText={setKategoriPengaduan}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Fumi
                        multiline
                        height={60}
                        label={'DESCRIPTION'}
                        iconClass={FontAwesomeIcon}
                        iconName={'clipboard'}
                        iconColor={'#283593'}
                        iconSize={20}
                        iconWidth={40}
                        style={{ borderRadius: 10, borderColor: '#000', borderWidth: 1, marginHorizontal: 10 }}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
                <TouchableOpacity onPress={openCamera} style={{ backgroundColor: '#283593', padding: 18, marginLeft: 10, marginRight: 10, borderRadius: 10, marginTop: 10, elevation: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Chose Image</Text>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={createPengaduan}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>Tambah Pengaduan</Text>
            </TouchableOpacity>
            <Modal visible={modalsukses} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={closeModal}>
                            <Text style={{ color: '#272727', fontSize: 18 }}>x</Text>
                        </TouchableOpacity>
                        <Image source={require('../img/berhasil.png')} style={{ width: 150, height: 150 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 16, color: '#272727', textAlign: 'center' }}>
                            Pengaduan berhasil dikirim, terima kasih
                        </Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 330, borderRadius: 9, elevation: 2 }} onPress={closeModal}>
                            <Text style={{ color: '#FFFFFF' }}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={kosong} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={closeModal}>
                            <Text style={{ color: '#272727', fontSize: 18 }}>x</Text>
                        </TouchableOpacity>
                        <Image source={require('../img/warning.png')} style={{ width: 165, height: 150 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 16, color: '#272727', textAlign: 'center' }}>
                            Opss, pengaduan mengandung kata-kata kasar
                        </Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#617eb7', paddingVertical: 10, width: 330, borderRadius: 9, elevation: 2 }} onPress={closeModal}>
                            <Text style={{ color: '#FFFFFF' }}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#202124',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#DADCE0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    addButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#283593',
        padding: 15,
        margin: 5,
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 20,
        color: '#fff',
    },
});

export default TambahPengaduan;
