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
import HistoryItem from './HistoryItem';
import SwapIcon from 'react-native-vector-icons/Ionicons'

const History = (props) => {
    const [visibilityModal, setVisibility] = useState(false)
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [copyLastOrders, setLastOrders] = useState([])
    const [isReversed, setIsReversed] = useState(false)

    const reverseLastOrders = () => {
        setIsReversed(!isReversed)
    }
    //Fazer essa função filtrar por mais parametros
    const filterList = (list) => {
        return list.filter(
            (listItem) =>
                listItem.establishment_info.name
                    .toLowerCase()
                    .includes(search.toLowerCase())

            // ||
            // listItem.song.toLowerCase().includes(search.toLowerCase()),
        );
    }

    const lastOrders = useSelector(state => state.customer.lastOrders)

    useEffect(() => {
        console.log(data)

    }, [visibilityModal])
    useEffect(() => {
        isReversed ?
            setLastOrders(lastOrders) : setLastOrders(lastOrders.reverse())
    }, [isReversed])
    return (
        <View style={{ flex: 1, backgroundColor: '#6200ee' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 40 }} >Histórico</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#6200ee', alignItems: 'center', justifyContent: 'center' }}>
                <TextInput
                    onChangeText={(search) => setSearch(search)}
                    style={{
                        fontSize: 24,
                        margin: 10,
                        width: '75%',
                        height: 60,
                        backgroundColor: 'white',
                        borderRadius: 10
                    }} />
                <SwapIcon
                    name="swap-vertical"
                    color="white"
                    size={40}
                    onPress={() => reverseLastOrders()}
                />
            </View>

            <View style={{ flex: 4, backgroundColor: '#6200ee' }}>
                <ScrollView style={{ flex: 1, margin: 10 }}>
                    {copyLastOrders ? filterList(copyLastOrders).map((item, index) => {
                        const soLongSince = moment(item.createdAt).fromNow();
                        const {

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
                                photo } } = item;
                        const somar = (acumulado, x) => acumulado + x;
                        const valores = orders.map((item) => {
                            if (item.confirmed === 1) {
                                return item.value * item.quantity;
                            } else {
                                return 0;
                            }
                        });
                        return (
                            <TouchableHighlight
                                key={index}
                                onPress={() => {
                                    setData(item);
                                    setVisibility(!visibilityModal);
                                }}>
                                < HistoryItem
                                    key={index}
                                    isClosed={isClosed}
                                    isPaid={isPaid}
                                    isCanceled={isCanceled}
                                    photo={photo}
                                    soLongSince={soLongSince}
                                    total={valores.reduce(somar).toFixed(2)}
                                    name={EstName}
                                    city={city}
                                    street={street}
                                    number={number}

                                />
                            </TouchableHighlight>
                        )
                    }) : <View></View>}
                </ScrollView>
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