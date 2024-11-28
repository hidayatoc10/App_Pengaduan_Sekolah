import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView, StyleSheet, RefreshControl, StatusBar, TextInput, ActivityIndicator } from "react-native";
import { API } from "../API/api";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";

const Explorasi = () => {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [id, setId] = useState();
    const [tanggalRegistrasi, setTanggalRegistrasi] = useState();
    const [pengaduanList, setPengaduanList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('tanggal_registrasi');
        await AsyncStorage.removeItem('id');
        navigation.replace('Login');
    };

    const dataPengaduan = async () => {
        const token = await AsyncStorage.getItem("token");
        setLoading(true);
        Axios.get(`${API}/api/semua_pengaduan`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setPengaduanList(response.data.data.pengaduan);
            }).catch((error) => {
                console.log("Error fetching data", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await dataPengaduan();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            dataPengaduan();
        }, [])
    );

    useEffect(() => {
        const fetchUserData = async () => {
            const username = await AsyncStorage.getItem("username");
            const name = await AsyncStorage.getItem("name");
            const email = await AsyncStorage.getItem("email");
            const id = await AsyncStorage.getItem("id");
            const tanggalRegistrasi = await AsyncStorage.getItem("tanggal_registrasi");
            setId(id);
            setName(name);
            setUsername(username);
            setEmail(email);
            setTanggalRegistrasi(tanggalRegistrasi);
        };
        fetchUserData();
    }, []);

    const filteredPengaduanList = pengaduanList.filter(pengaduan =>
        pengaduan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pengaduan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return { backgroundColor: '#FFD700', color: '#000', };
            case 'MENUNGGU':
                return { backgroundColor: '#808080', color: '#FFF' };
            case 'SELESAI':
                return { backgroundColor: '#32CD32', color: '#FFF' };
            case 'DITOLAK':
                return { backgroundColor: '#FF4500', color: '#FFF' };
            default:
                return { backgroundColor: '#FFFFFF', color: '#000' };
        }
    };

    // Elevation Button component
    const ElevationButton = () => {
        const [isPressed, setIsPressed] = useState(false);

        const handlePressIn = () => setIsPressed(true);
        const handlePressOut = () => setIsPressed(false);

        return (
            <TouchableOpacity
                style={[styles.elevationButton, isPressed && styles.pressed]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => navigation.navigate("TambahPengaduan")} // Navigating to a new screen (adjust as needed)
            >
                <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.logoutText}>Semua Pengaduan</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5 }}>
                <TextInput
                    style={{ borderColor: 'grey', borderWidth: 1, flex: 1, borderRadius: 4, paddingLeft: 10 }}
                    placeholder="Masukkan Pencarian"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
                ) : (
                    filteredPengaduanList.map((pengaduan) => (
                        <View key={pengaduan.id} style={styles.card}>
                            <Text style={styles.title}>{pengaduan.title}</Text>
                            <Text style={styles.description}>{pengaduan.description}</Text>
                            <View style={[styles.statusContainer, getStatusStyle(pengaduan.status_pengaduan)]}>
                                <Text style={styles.statusText}>{pengaduan.status_pengaduan}</Text>
                            </View>
                            <Text style={styles.date}>Tanggal Lapor: {pengaduan.tanggal_lapor}</Text>
                            <Text style={styles.category}>Kategori Lapor: {pengaduan.kategori_pengaduan}</Text>
                            <Text style={styles.note}>Komentar Petugas: {pengaduan.description_petugas}</Text>
                            <View style={{ marginTop: 30 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.note}>Gambar Laporan Anda</Text>
                                <View style={{ marginRight: '20%' }} />
                                <Text style={styles.note}>Respon Petugas</Text>
                            </View>
                            {pengaduan.image && (
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <Image
                                            source={{ uri: `${API}${pengaduan.image}` }}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                        <Image
                                            source={pengaduan.image_petugas ? { uri: `${API}${pengaduan.image_petugas}` } : require('../img/proses.png')}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <Text>Update: {pengaduan.updated_at}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
            <ElevationButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    logoutText: {
        fontSize: 20,
        color: '#007bff',
    },
    card: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    description: {
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
    },
    statusContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    date: {
        fontSize: 12,
        marginBottom: 5,
        color: '#000',
    },
    category: {
        fontSize: 12,
        marginBottom: 5,
        color: '#000',
    },
    note: {
        fontSize: 12,
        marginBottom: 10,
        color: '#000',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    elevationButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        zIndex: 1,
    },
    pressed: {
        elevation: 16,
        shadowOpacity: 0.3,
    },
});

export default Explorasi;