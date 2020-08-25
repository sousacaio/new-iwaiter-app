
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
import { ScrollView } from 'react-native-gesture-handler';
import { connect, useDispatch } from 'react-redux';
import { storeUserInfo } from '../actions/customerActions';

const SignUp = () => {
    const { login } = useAuth();
    const dispatch = useDispatch();
    const storeUserInfoInRedux = (data) => {
        dispatch(storeUserInfo(data))
    }
    const bringUserInfo = async (id) => {
        const response = await api.get(`/customers/info/${id}`)
        console.log(response)
        const { data: { data: { customerOrders, customers } } } = response;
        const { _id, createdAt, email, name, photo } = customers[0];
        storeUserInfoInRedux({
            lastOrders: customerOrders,
            name: name,
            email: email,
            id: _id,
            createdAt: createdAt,
            photo: photo
        })
    }
    const loginApi = async (email, password) => {
        try {
            await api.post('/customers/auth', { email, password }).then(async (response) => {

                if (response) {
                    await AsyncStorage.setItem('email', email);
                    AsyncStorage.setItem('password', password);
                    const { data: { data: { token, customer: { _id, name, photo } } } } = response;
                    bringUserInfo(_id)
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
            .required('É necessário um email válido para se registrar'),
        password: Yup.string()
            .label('Password')
            .required('O campo "senha" não pode ficar em branco')
            .min(4, 'A senha tem que ter pelo menos 6 caracteres '),
        passwordConfirmation: Yup.string()
            .label('passwordConfirmation')
            .required('A confirmação de senha é necessária')
            .min(4, 'A confirmação de senha tem que ter pelo menos 6 caracteres ')
            .test('passwords-match', 'As senhas devem ser iguais', function (value) {
                return this.parent.password === value;
            }),
        name: Yup.string()
            .label('Name')
            .min(1, 'Seu nome deve ter mais de uma letra')
            .required('É necessário um nome válido para se registrar'),
    })
    useEffect(() => {
        console.log('montou signup')
        return () => {
            console.log('desmontou signup')
        }
    }, []);
    const register = async (values) => {
        const response = await api.post('customers', values);
        const { data: { data }, message, success } = response;
        if (data) {
            const { email, password } = data;
            loginApi(email, password);
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Formik
                initialValues={{ email: '', password: '', name: '', passwordConfirmation: '' }}
                onSubmit={values => { register(values) }}
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
                        <ScrollView style={{ flex: 1 }}>
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
                                <TextInput
                                    style={{ margin: 15, borderBottomColor: '#6200ee', borderBottomWidth: 1 }}
                                    value={values.passwordConfirmation}
                                    onChangeText={handleChange('passwordConfirmation')}
                                    placeholder="Confirmação de senha"
                                    autoCapitalize="none"
                                    onBlur={handleBlur('passwordConfirmation')}
                                    secureTextEntry={true}
                                />
                                <ErrorMessage errorValue={touched.passwordConfirmation && errors.passwordConfirmation} />
                                <TextInput
                                    style={{ margin: 15, borderBottomColor: '#6200ee', borderBottomWidth: 1 }}
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    placeholder="Nome"
                                    autoCapitalize="none"
                                    onBlur={handleBlur('name')}
                                />
                                <ErrorMessage errorValue={touched.name && errors.name} />
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
                                        Registrar
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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

export default connect(null, null)(SignUp);