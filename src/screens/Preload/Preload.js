/* eslint-disable */
import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    ToastAndroid
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../../services/authContext';
import api from '../../services/axios';
import { useNavigation } from '@react-navigation/native';
import Reactotron from 'reactotron-react-native';
import { connect, useSelector } from 'react-redux';
import { storeOrderedItems, storeOrderId } from '../../actions/cartActions';
import { storeUserInfo } from '../../actions/customerActions';
import Icon from 'react-native-vector-icons/Entypo';

const Preload = (props) => {
    const { login } = useAuth();
    const navigation = useNavigation();
    const storeUserInfoInRedux = (data) => {
        props.storeUserInfo(data);
    };
    const bringUserInfo = async () => {
        try {
            const response = await api.get(
                `/customers/info/${await AsyncStorage.getItem('customer_id')}`,
            );

            const {
                data: {
                    data: { customerOrders, customers },
                },
            } = response;
            const { _id, createdAt, email, name, photo } = customers[0];
            storeUserInfoInRedux({
                lastOrders: customerOrders,
                name: name,
                email: email,
                id: _id,
                createdAt: createdAt,
                photo: photo,
            });
        } catch (error) {

        }

    };
    const storeOrderItems = (data) => {
        props.storeOrderedItems(data);
    };
    const storeOrderIdRedux = (data) => {
        props.storeOrderId(data);
    };
    const loginApi = async () => {
        const id_establishment = await AsyncStorage.getItem('id_establishment');
        const id_point = await AsyncStorage.getItem('id_point');
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');
        const orderId = await AsyncStorage.getItem('order_id');
        console.log('antes dos ifs')
        if (id_establishment && id_point && email && password) {
            bringUserInfo()
            const res = await api.post('/customers/auth/orderOpen', {
                email,
                password,
                id_establishment,
                id_point,
                id_order: orderId,
            });
            const {
                data: { message, response, status }
            } = res;

            const {
                data
            } = response;

            const {
                customer, token, checkData
            } = data;

            if (status === 200) {
                if (checkData) {
                    ToastAndroid.showWithGravity(
                        'Ordem carregada com sucesso',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                    const { _id, orders, isClosed, isPaid } = checkData;
                    storeOrderItems(orders);
                    storeOrderIdRedux(_id);
                    await AsyncStorage.setItem('order_id', _id);
                    await AsyncStorage.setItem('isClosed', JSON.stringify(isClosed));
                    await AsyncStorage.setItem('isPaid', JSON.stringify(isPaid));
                    await AsyncStorage.setItem('isFirstOrder', 'false');
                } else {
                    await AsyncStorage.setItem('isFirstOrder', 'true');
                    await AsyncStorage.removeItem('order_id');
                }
                const { _id, name, photo } = customer;
                await AsyncStorage.setItem('name', name);
                if (photo) {
                    AsyncStorage.setItem('photo', photo);
                }
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('customer_id', _id);

                if (id_establishment && id_point) {
                    console.log(id_point)
                    console.log(id_establishment)
                    ToastAndroid.showWithGravity(
                        'Catalogo carregado com sucesso',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                    login();
                    console.log('eh pra ir pra comanda aberta daqui')
                    navigation.navigate('MainTab', {
                        screen: 'Home',
                        params: {
                            id_point: id_point,
                            id_establishment: id_establishment,
                        },
                    });
                } else {
                    setTimeout(() => {
                        console.log('Main tab 1')
                        navigation.reset({
                            routes: [{ name: 'MainTab' }]
                        })

                        login();
                    }, 1000);
                }
            } else {
                ToastAndroid.showWithGravity(
                    message,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }

        }
        if (email && password && !id_establishment && !id_point) {
            bringUserInfo()
            const response = await api.post('/customers/auth', { email, password });

            if (response) {
                await AsyncStorage.setItem('email', email);
                AsyncStorage.setItem('password', password);
                const {
                    data: {
                        data: {
                            token,
                            customer: { _id, name, photo },
                        },
                    },
                } = response;

                AsyncStorage.setItem('name', name);
                if (photo) {
                    AsyncStorage.setItem('photo', photo);
                }
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('customer_id', _id);



                setTimeout(() => {
                    login();
                    console.log('Main tab 2')
                    navigation.reset({
                        routes: [{ name: 'MainTab' }]
                    })
                }, 1000);
            }
        }
        if (!email && !password && !id_establishment && !id_point) {
            console.log('Main tab 3')
            navigation.reset({
                routes: [{ name: 'MainTab' }]
            })
        }
    };
    async function getInfoFromStorage() {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
                stores.map((result, i, store) => {
                    console.log({ [store[i][0]]: store[i][1] });
                    return true;
                });
            });
        });
    }
    useEffect(() => {
        getInfoFromStorage();
        loginApi();
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#6200ee' }}>
                <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="drink" size={80} color="white" />
                    <Text style={{ fontSize: 30, color: 'white' }}>iWaiter</Text>
                </View>
                <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            </View>
        </SafeAreaView>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderedItems: (id) => {
            dispatch(storeOrderedItems(id));
        },
        storeOrderId: (id) => {
            dispatch(storeOrderId(id));
        },
        storeUserInfo: (id) => {
            dispatch(storeUserInfo(id));
        },
    };
};
export default connect(null, mapDispatchToProps)(Preload);