import React, { useEffect, useState } from 'react';
import {
    Text, View, FlatList,
    ScrollView,
    Dimensions, Modal, StyleSheet,
    Button, TouchableOpacity, ToastAndroid, RefreshControl
} from 'react-native';
import Reactotron from 'reactotron-react-native';
import Tags from '../Tags';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window')
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';
import IconHandler from './IconHandler';
import { connect } from 'react-redux'
const MyOrdersModal = ({ visibilityMyOrders, total, setVisibilityMyOrders, items, storeNewOrders }) => {
    const [refresh, setRefresh] = useState(false)
    const [orderId, setOrderId] = useState('')
    const orderedItems = useSelector(state => state.orderedItems);

    const somar = (acumulado, x) => acumulado + x;
    const valores = orderedItems.map((item) => {
        if (item.confirmed === 1) {
            return item.value * item.quantity
        } else {
            return 0;
        }
    });

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
        const storedOrderId = await AsyncStorage.getItem('order_id');
        setOrderId(storedOrderId)
    }
    useEffect(() => {
        loadCredentials();
    }, [])
    useEffect(() => {
        Reactotron.log('refrescou')
        loadCredentials();
    }, [visibilityMyOrders, refresh])
    const LoadOrders = async () => {
        setRefresh(true)
        const response = await api.get(`orders/getById/${orderId}`);
        const { data: { data } } = response;
        const { orders } = data;
        storeNewOrders(orders);
        setRefresh(false)

        setRefresh(false)

    }
    const renderOrderedItems = (item, index) => {
        return (
            <View style={{
                flex: 1, backgroundColor: '#FAFAFA', margin: 10,
                borderColor: '#6200ee',
                borderBottomWidth: 6,
                borderRadius: 5,
                padding: 10
            }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#6200ee', }}>
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>{item.quantity}x</Text>
                    </View>
                    <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <IconHandler status={item.confirmed} />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{
                        flex: 1,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 20 }}>Unidade: </Text>
                        <Text style={{ fontSize: 20 }}>R${parseFloat(item.value).toFixed(2)}  </Text>
                    </View>
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>Total do item:</Text>
                        <Text style={{ fontSize: 20 }}>Total:R${parseFloat(item.value * item.quantity).toFixed(2)} </Text>
                    </View>
                </View>
            </View>
        );
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibilityMyOrders}
        >
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.nameContainer}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.nameText}
                            >Seus pedidos
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 4, }}>
                        <View style={{ flex: 3, marginTop: 10 }}>
                            <SafeAreaView>
                                {items.length > 0 ?
                                    <FlatList
                                        refreshControl={<RefreshControl
                                            colors={["#6200ee"]}
                                            refreshing={refresh}
                                            onRefresh={() => LoadOrders()}
                                        />}
                                        data={items}
                                        renderItem={({ item, index }) => renderOrderedItems(item, index)}
                                        keyExtractor={(item, index) => item._id + index}
                                        onEndReached={() => { LoadOrders() }}
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
                                    <Text adjustsFontSizeToFit={true}
                                        style={{ color: '#A6A6A6', fontSize: 30 }}> Total</Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text adjustsFontSizeToFit={true}
                                        style={{ color: 'black', fontSize: 30 }}> R$ {
                                            orderedItems.length > 0 ?
                                                valores.reduce(somar).toFixed(2) :
                                                0
                                        }</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'stretch' }}>
                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => { }}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={{
                                            color: 'white'
                                        }}>{'Fechar comanda'} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => {
                                        setVisibilityMyOrders(false)
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
export default connect(null, null)(MyOrdersModal);