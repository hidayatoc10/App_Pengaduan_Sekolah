import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { API } from "../API/api";
import { useNavigation } from "@react-navigation/native";

const PengaduanSaya = () => {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [id, setId] = useState();
    const [tanggalRegistrasi, setTanggalRegistrasi] = useState();
    const [pengaduanList, setPengaduanList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [logoutt, setlogoutt] = useState(false);


    const dataPengaduan = async () => {
        const token = await AsyncStorage.getItem("token");
        Axios.get(`${API}/api/pengaduan_user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setPengaduanList(response.data.data.pengaduan);
            }).catch((error) => {
                console.log("Error fetching data", error);
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
        dataPengaduan();
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

    return (
        <View
            style={styles.container}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.logoutText}>Pengaduan Saya</Text>
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {pengaduanList.map((pengaduan) => (
                    <View key={pengaduan.id} style={styles.card}>
                        <Text style={styles.title}>{pengaduan.title}</Text>
                        <Text style={styles.description}>{pengaduan.description}</Text>
                        <View style={[styles.statusContainer, getStatusStyle(pengaduan.status_pengaduan)]}>
                            <Text style={styles.statusText}>{pengaduan.status_pengaduan}</Text>
                        </View>
                        <Text style={styles.date}>Tanggal Lapor: {pengaduan.tanggal_lapor}</Text>
                        <Text style={styles.category}>Kategori Lapor: {pengaduan.kategori_pengaduan}</Text>
                        <Text style={styles.note}>Komentar Petugas: {pengaduan.description_petugas}</Text>
                        <View style={{ marginTop: 30, }} />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.note}>Gambar Laporan Anda</Text>
                            <View style={{ marginRight: '20%' }} />
                            <Text style={styles.note}>Gambar Petugas</Text>
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
                                    <Text>
                                        Update: {pengaduan.updated_at}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={() => navigation.navigate('TambahPengaduan')}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>Tambah Pengaduan</Text>
            </TouchableOpacity>
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
        marginTop: 35,
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
    addButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 20,
        color: '#fff',
    },
});

export default PengaduanSaya;
