/*eslint-disable*/
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';

export const checkOrderStatus = async (orderId) => {
    try {
        let newOrderId = '';
        if (!orderId) {
            newOrderId = await AsyncStorage.getItem('order_id')
        } else {
            newOrderId = orderId
        }
        const res = await api.get(`orders/getById/${newOrderId}`);
        const { data: { status, response: { data: { orders, establishment_info, customer }, }, }, } = res;
        if (status === 200) {
            const checkActualizedOrders = orders.filter((item) => { return item.confirmed !== 0; });
            if (checkActualizedOrders.length > 0) {
                return { success: false, orders: [], message: 'Cancelamento não é possível.Um dos seus pedidos já foi confirmado ou está em espera' }
            } else {
                const resultCancel = await cancelOrder(newOrderId, establishment_info._id, customer);
                if (resultCancel.status === 200) {
                    await AsyncStorage.removeItem('order_id');
                    await AsyncStorage.removeItem('id_establishment');
                    await AsyncStorage.removeItem('id_point');
                    await AsyncStorage.setItem('isFirstOrder', 'true');
                    return { success: true, message: resultCancel.message, orders }
                } else {
                    return { success: false, message: 'Houve um problema com a sua requisição.Por favor,tente mais tarde.', orders: [] }
                }
            }
        } else {
            return { success: false, message: 'Houve um erro na requisição.Por favor,tente mais tarde.1', orders: [] }
        }

    } catch (error) {
        return { success: false, message: 'Houve um erro na requisição.Por favor,tente mais tarde.Erro 2', orders: [], error }
    }
}
export const cancelOrder = async (orderId, idEst, customerId) => {
    try {
        const res = await api.post(`orders/${orderId}/cancelOrder/${idEst}/${customerId}`);
        const { data: { message, status } } = res;
        if (status === 200) {
            return { status, message }
        } else {
            return { status: 400 }
        }
    } catch (error) {
        return { status: 400 }
    }
}

export const createNewOrder = async (cartItems, customer, establishment, point) => {
    try {
        const res = await api.post(`orders/create/${customer}/${establishment}/${point}`, cartItems);
        const { data: { response, status }, } = res;
        if (status === 201) {
            const { data } = response;
            const { orders, _id } = data;
            await AsyncStorage.setItem('isFirstOrder', 'false');
            await AsyncStorage.setItem('order_id', _id);
            return { idOrder: _id, orders, clearTheCart: true, isFirstOrder: false }
        } else {
            return { idOrder: null, orders: null, clearTheCart: false, isFirstOrder: true, message: 'Houve um problema ao processar sua requisição.Por favor,reinicie o app.' }
        }
    } catch (error) {
        console.log(error);
        return { idOrder: null, orders: null, clearTheCart: false, isFirstOrder: true, message: 'Houve um problema ao processar sua requisição.Por favor,reinicie o app.' }
    }
};