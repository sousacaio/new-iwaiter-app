import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/axios';

const loginOnOpenAppAndCheckActiveOrders = async () => {
    const id_establishment = await AsyncStorage.getItem('id_establishment');
    const id_point = await AsyncStorage.getItem('id_point');
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const orderId = await AsyncStorage.getItem('order_id');

    if (id_establishment && id_point && email && password) {
        const response = await api.post('/customers/auth/orderOpen', {
            email, password, id_establishment, id_point, orderId
        });
        const { data: { data } } = response;
        const { customer, token, checkData } = data;
        if (customer) {
            if (checkData) {
                const { _id, orders, isClosed, isPaid } = checkData;
                storeOrderItems(orders);
                storeOrderIdRedux(_id)
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
                login();
                navigation.navigate('Comanda', {
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
    }
    if (email && password && !id_establishment && !id_point) {
        console.log('Chegou aqui')
        const response = await api.post('/customers/auth', { email, password });
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
            bringUserInfo()
            setTimeout(() => {

                login();
            }, 1000);
        }
    }
};