import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../API/api';

const EditUserScreen = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const nama = await AsyncStorage.getItem('name');
        const username = await AsyncStorage.getItem('username');
        const email = await AsyncStorage.getItem('email');

        setName(nama);
        setUsername(username);
        setEmail(email);
    };

    const handleUpdate = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const response = await axios.put(`${API}/api/user/edit/${storedUsername}`, {
                name,
                username,
                email,
                password,
            });

            if (response.data.status) {
                Alert.alert('Success', 'User updated successfully');
                await AsyncStorage.setItem('name', name);
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('email', email);
            } else {
                Alert.alert('Failed', response.data.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Could not update user');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <View style={{ marginTop: 20 }} />
            <Text>Edit Profile</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <Button title="Update" onPress={handleUpdate} />
        </View>
    );
};

export default EditUserScreen;
