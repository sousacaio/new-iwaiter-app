
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../services/authContext';
import api from '../services/axios';
import { useNavigation } from '@react-navigation/native';
import Reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';
import { storeOrderedItems } from '../actions/cartActions';
const Home = (props) => {
    const { login } = useAuth();
    const navigation = useNavigation();
    const storeOrderItems = (data) => {
        props.storeOrderedItems(data)
    }
    const loginApi = async () => {
        const id_establishment = await AsyncStorage.getItem('id_establishment');
        const id_point = await AsyncStorage.getItem('id_point');
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');
        const response = await api.post('/customers/auth/orderOpen', {
            email, password, id_establishment, id_point
        });

        const { data: { data } } = response;
        const { customer, token, checkData } = data;
        if (customer) {
            Reactotron.log('checkData');
            Reactotron.log(checkData);
            if (checkData) {
                const { _id, orders, isClosed, isPaid } = checkData;
                storeOrderItems(orders);
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
                navigation.navigate('Comanda2', {
                    screen: 'Scan',
                    params: {
                        id_point: id_point,
                        id_establishment: id_establishment
                    }
                });
            } else {
                setTimeout(() => {
                    login();
                }, 1000);
            }
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
    const clear = async () => {
        await AsyncStorage.clear()
    }
    useEffect(() => {
        getInfoFromStorage()
        //clear();
        loginApi()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Text>
                    Home
                </Text>
            </View>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => {
    return {
        items: state.addedItems,
        isFirstOrder: state.isFirstOrder,
        total: state.total,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderedItems: (id) => { dispatch(storeOrderedItems(id)) },
    }
}
export default connect(null, mapDispatchToProps)(Home)