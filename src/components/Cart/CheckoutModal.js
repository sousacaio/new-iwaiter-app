import React, { useEffect, useState } from 'react';
import {
    Text, View, FlatList,
    ScrollView,
    Dimensions, Modal, StyleSheet,
    Button, TouchableOpacity, ToastAndroid
} from 'react-native';
import Reactotron from 'reactotron-react-native';
import Tags from '../Tags';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window')
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, useDispatch, useSelector } from 'react-redux';
import { storeOrderId } from '../../actions/cartActions';
const CheckoutModal = ({ modalVisible, total, setModalVisible, items, clearTheCart, storeNewOrders }) => {
    const dispatch = useDispatch();
    const orderIdRedux = useSelector(state => state.cart.orderId)
    const [customer, setCustomer] = useState('')
    const [establishment, setEstablishment] = useState('')
    const [point, setPoint] = useState('')
    const [isFirstOrder, setIsFirstOrder] = useState('')
    const [orderId, setOrderId] = useState('')
    const EmptyCart = () => {
        return (<View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50
        }}>
            <Text>
                Carrinho vazio
            </Text>
        </View>)
    }
    const loadCredentials = async () => {
        setCustomer(await AsyncStorage.getItem('customer_id'));
        setPoint(await AsyncStorage.getItem('id_point'));
        setEstablishment(await AsyncStorage.getItem('id_establishment'));
        setIsFirstOrder(await AsyncStorage.getItem('isFirstOrder'));
        setOrderId(await AsyncStorage.getItem('order_id'));
    }
    const dispatchOrder = (data) => {
        dispatch(storeOrderId(data))
    }
    useEffect(() => {
        loadCredentials();
    }, [modalVisible])
    const createOrder = async () => {
        const response = await api.post(`orders/create/${customer}/${establishment}/${point}`, transformIdItems(items));
        const { data } = response;
        const { success } = data;
        const desambiguation = data.data;
        if (success) {
            await AsyncStorage.setItem('isFirstOrder', 'false')
            const { orders, _id } = desambiguation;
            Reactotron.log('id da order criada:' + '\n' + _id)
            console.log('id da order criada:' + '\n' + _id)
            await AsyncStorage.setItem('order_id', _id);
            console.log('confirm:' + await AsyncStorage.getItem('order_id'));
            dispatchOrder(_id)
            console.log('no redux:' + orderIdRedux)
            setOrderId(_id)
            setModalVisible(false)
            storeNewOrders(orders);
            clearTheCart()
            ToastAndroid.show(
                'Pedido efetuado com sucesso!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
            );

        }
    }
    const transformIdItems = (itemsFromCart) => {
        const newItemsFromCart = itemsFromCart.map((item) => {
            const idProduct = item._id;
            delete item._id;
            return { ...item, id_product: idProduct }
        })
        return newItemsFromCart;
    }
    const newRequest = async () => {
        console.log('new request');
        const itemsCopy = items;
        const newItems = transformIdItems(itemsCopy);
        const response = await api.post(`orders/${orderId}/request`, newItems);
        console.log('response')
        console.log(response)
        const { data } = response;
        const { success } = data;
        const desambiguation = data.data;
        const { orders } = desambiguation;
        if (success) {
            setModalVisible(false)
            storeNewOrders(orders);
            clearTheCart()
            ToastAndroid.show(
                'Pedido efetuado com sucesso!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
            );
        }
    }
    const somar = (acumulado, x) => acumulado + x;
    const valores = items.map((item) => {
        if (item.confirmed === 1) {
            return item.value * item.quantity
        } else {
            return 0;
        }
    });
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.nameContainer}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.nameText}
                            >Checkout
                            </Text>
                        </View>

                    </View>
                    <View style={{ flex: 4, }}>
                        <View style={{ flex: 3, marginTop: 10 }}>
                            <SafeAreaView>
                                {items.length > 0 ?
                                    <FlatList
                                        data={items}
                                        renderItem={({ item, index }) => (
                                            <View style={{
                                                flex: 1, backgroundColor: '#FAFAFA', margin: 10,
                                                borderColor: '#6200ee',
                                                borderBottomWidth: 6,
                                                borderRadius: 5,
                                                padding: 10
                                            }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#6200ee', }}>
                                                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 20 }}>Status</Text>
                                                    </View>
                                                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 20 }}>{item.quantity}x</Text>
                                                    </View>
                                                    <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 20 }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{
                                                        flex: 1,
                                                        alignContent: 'center',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Tags bg="#6200ee">
                                                            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 20, color: 'white' }}>Unidade</Text>
                                                                <Text style={{ fontSize: 20, color: 'white' }}>R${parseFloat(item.value).toFixed(2)}</Text>
                                                            </View>
                                                        </Tags>
                                                    </View>
                                                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Tags bg="#6200ee">
                                                            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 20, color: 'white' }}>Total do item:</Text>
                                                                <Text style={{ fontSize: 20, color: 'white' }}>R${parseFloat(item.value * item.quantity).toFixed(2)} </Text>
                                                            </View>
                                                        </Tags>
                                                    </View>
                                                </View>
                                            </View>

                                        )}
                                        keyExtractor={(item, index) => `list-item-${index}`}
                                        ListEmptyComponent={<EmptyCart />}
                                    />
                                    : <EmptyCart />}
                            </SafeAreaView>
                        </View>
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            backgroundColor: '#FCFCFC',
                            borderTopLeftRadius: 20,
                            borderTopRigthRadius: 20,
                        }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 }} >
                                    <Text adjus tsFontSizeToFit={true}
                                        style={{ color: '#A6A6A6', fontSize: 30 }}> Total</Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text adjustsFontSizeToFit={true}
                                        style={{ color: 'black', fontSize: 30 }}> R$ {total}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'stretch' }}>
                                {items.length > 0 ?
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={() => {
                                            isFirstOrder === 'false' ?
                                                newRequest()
                                                : createOrder()
                                        }}>
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            style={{
                                                color: 'white'
                                            }}>{'Fechar pedido'} </Text>
                                    </TouchableOpacity>
                                    : <View></View>}

                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => {
                                        setModalVisible(false)
                                    }}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={{
                                            color: 'white'
                                        }}>{'Voltar para o carrinho'} </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal >)
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#FCFCFC',

    },

    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    image: {
        width: width / 1.2,
        height: height / 2,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 5
    },
    contentContainer: {
        flex: 1,
        margin: 10
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    nameContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    },
    nameText: {
        fontWeight: 'bold',
        fontSize: 30,
        fontStyle: 'italic',
        alignSelf: 'flex-start'
    },
    valueContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        backgroundColor: '#6200ee',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    }
});
export default connect(null, null)(CheckoutModal);