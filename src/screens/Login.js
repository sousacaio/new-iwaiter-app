
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../services/authContext';
import api from '../services/axios';
import Reactotron from 'reactotron-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup'
import ErrorMessage from '../components/ErrorMessage';


export default Login = () => {
    const { login } = useAuth();
    console.log(login)
    const loginApi =async (email, password) => {       
        console.log(email,password)
        console.log('chegou aqui')
        try {
                await api.post('/customers/auth', { email, password }).then(async (response) => {
            console.log('chegou aqui')
            console.log(response)
            if (response) {
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
            console.log(error)
        });
        } catch (error) {
            console.log(error)
        }
   
    };
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .label('Email')
            .email('Digite um email válido')
            .required('É necessário um email para fazer login'),
        password: Yup.string()
            .label('Password')
            .required('O campo "senha" não pode ficar em branco')
            .min(4, 'A senha tem que ter pelo menos 6 caracteres ')
    })
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
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={values => { loginApi(values.email,values.password) }}
                validationSchema={validationSchema}
            >
                {({ handleChange,
                    values,
                    handleSubmit,
                    errors,
                    isValid,
                    touched,
                    handleBlur,
                }) => (
                        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>

                            <TextInput
                                style={{ margin: 15, borderBottomColor: '#6200ee', borderBottomWidth: 1 }}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                placeholder="Email"
                                autoCapitalize="none"
                                onBlur={handleBlur('email')}
                            />
                            <ErrorMessage errorValue={touched.email && errors.email} />
                            <TextInput
                                style={{ margin: 15, borderBottomColor: '#6200ee', borderBottomWidth: 1 }}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                placeholder="Senha"
                                autoCapitalize="none"
                                onBlur={handleBlur('password')}
                                secureTextEntry={true}
                            />
                            <ErrorMessage errorValue={touched.password && errors.password} />
                            <TouchableOpacity
                                style={{
                                    height: 60,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: !isValid ? 'grey' : '#6200ee',
                                    borderRadius: 5,
                                    borderColor: 'white',
                                    margin: 15
                                }}
                                onPress={handleSubmit}
                            //disabled={!isValid || isSubmitting}
                            >
                                <Text style={{ color: 'white' }}>
                                    Login
                                
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </Formik>
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