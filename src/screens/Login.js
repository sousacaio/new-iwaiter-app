
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../services/authContext';
import api from '../services/axios';
import Reactotron from 'reactotron-react-native';
export default Login = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const loginApi = (email, password) => {
        api.post('/customers/auth', { email, password }).then(async (response) => {
            if (response) {
                setLoading(true);
                await AsyncStorage.setItem('email', email);
                AsyncStorage.setItem('password', password);
                const { data: { data: { token, customer: { _id, name, photo } } } } = response;
                AsyncStorage.setItem('name', name);
                if (photo) {
                    AsyncStorage.setItem('photo', photo);
                }
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('customer_id', _id);
                setTimeout(() => {
                    login();
                }, 1000);
            }
        }).catch(function (error) {
            Reactotron.error(error)
        });
    };

    async function directLogin() {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');
        console.log(storedEmail);
        console.log(storedPassword);
        if (storedEmail && storedPassword) {
            loginApi(storedEmail, storedPassword)
        }
    }
    useEffect(() => {
        console.log('montou login')
        directLogin();
        return () => {
            console.log('desmontou login')
        }
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.form}>
                <TextInput label="Email"
                    value={email} style={styles.textInput} onChangeText={email => setEmail(email)} />
                <TextInput
                    label="Senha"
                    style={styles.textInput}
                    value={password}
                    onChangeText={password => setPassword(password)}
                    secureTextEntry={true}
                />
                <Button title="fazer login" onPress={() => loginApi(email, password)} style={styles.button} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 8,
        paddingTop: 140,
        //justifyContent: 'center',
    },
    button: {
        margin: 8,
    },
    textInput: {
        marginVertical: 20,
        backgroundColor: 'white',
    },
})