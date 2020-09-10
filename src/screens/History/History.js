/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
    View,
    ActivityIndicator, TextInput,
    Text, FlatList, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../services/authContext';
import api from '../../services/axios';
import { useNavigation } from '@react-navigation/native';
import Reactotron from 'reactotron-react-native';
import { connect, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import moment from "moment";
import "moment/locale/pt-br";
import { TouchableHighlight } from 'react-native-gesture-handler';
import DetailOrder from './DetailOrder'


const History = (props) => {
    const [visibilityModal, setVisibility] = useState(false)
    const [data, setData] = useState([])

    const lastOrders = useSelector(state => state.customer.lastOrders)

    useEffect(() => {

    }, [visibilityModal])
    return (
        <View style={{ flex: 1, backgroundColor: '#6200ee' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 40 }} >Histórico</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: '#6200ee' }}>
                <TextInput style={{ flex: 1, backgroundColor: 'white', margin: 20, borderRadius: 5 }} />
            </View>
            <View style={{ flex: 5 }}>
                <FlatList
                    ListHeaderComponent={<View></View>}
                    ListFooterComponent={<View></View>}
                    data={lastOrders}
                    keyExtractor={(item, index) => `list-item-${index}`}
                    renderItem={(item, index) => {
                        //console.log(JSON.stringify(item.item, null, '\t'))
                        const soLongSince = moment(item.item.createdAt).fromNow();
                        const { item:
                            {
                                isPaid,
                                isClosed,
                                isCanceled,
                                orders,
                                establishment_info: {
                                    name: EstName,
                                    address: {
                                        street,
                                        city,
                                        number },
                                    photo } } } = item;
                        const somar = (acumulado, x) => acumulado + x;
                        const valores = orders.map((item) => {
                            if (item.confirmed === 1) {
                                return item.value * item.quantity;
                            } else {
                                return 0;
                            }
                        });

                        return (
                            <TouchableHighlight onPress={() => {
                                setData(item.item),
                                    setVisibility(!visibilityModal)
                            }}>
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    margin: 10,
                                    borderRadius: 10,
                                }}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                                        <Text>
                                            {isClosed ? 'Fechada' : 'Não fechada'}
                                        </Text>
                                        {isPaid ? <Text>
                                            Paga
                                        </Text> : <View></View>}
                                        {isCanceled ? <Text>
                                            Cancelada
                                            </Text> : <View></View>}

                                    </View>
                                    <View style={{
                                        flex: 4,
                                        flexDirection: 'row'
                                    }}>
                                        <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                                            <View style={{ flex: 1 }}>
                                                <Image
                                                    resizeMode={'cover'}
                                                    style={{
                                                        flex: 1,
                                                        width: undefined,
                                                        height: undefined,
                                                        borderRadius: 5,
                                                    }}
                                                    source={{
                                                        uri: photo
                                                            ? `http://192.168.15.5:3000/${photo}`
                                                            : 'https://i.pinimg.com/originals/48/78/6d/48786db88c95237f6e0b375dc991448a.png',
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                                            <Text>
                                                {soLongSince}
                                            </Text>
                                            <Text>
                                                R$ {valores.reduce(somar).toFixed(2)}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                                            <Text>
                                                {EstName}
                                            </Text>
                                            <Text>
                                                {city}
                                            </Text>
                                            <Text>
                                                {street},{number}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>)
                    }
                    }
                />
            </View>

            {data ?
                <DetailOrder
                    setVisibility={setVisibility}
                    visibilityModal={visibilityModal}
                    data={data}
                /> : <View></View>}
        </View>
    )
}

export default connect(null, null)(History);