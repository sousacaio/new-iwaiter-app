
import React, { useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    ScrollView,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../../services/authContext';
import api from '../../services/axios';
import { useNavigation } from '@react-navigation/native';
import Reactotron from 'reactotron-react-native';
import { connect, useSelector } from 'react-redux';
import { storeOrderedItems, storeOrderId } from '../../actions/cartActions';
import { storeUserInfo } from '../../actions/customerActions';
import Icon from 'react-native-vector-icons/Ionicons'
import RenderEstablishments from './RenderEstablishments';
import RenderPromos from './RenderPromos';
import RenderCategories from './RenderCategories';
import RenderRecomended from './RenderRecomended';
const { width } = Dimensions.get('window')
const Home = (props) => {
    const { login } = useAuth();
    const navigation = useNavigation();
    const storeUserInfoInRedux = (data) => {
        props.storeUserInfo(data)
    }
    const bringUserInfo = async () => {
        const response = await api.get(`/customers/info/${await AsyncStorage.getItem('customer_id')}`)
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
    const storeOrderItems = (data) => {
        props.storeOrderedItems(data)
    }
    const storeOrderIdRedux = (data) => {
        props.storeOrderId(data)
    }

    const loginApi = async () => {
        const id_establishment = await AsyncStorage.getItem('id_establishment');
        const id_point = await AsyncStorage.getItem('id_point');
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');
        if (id_establishment && id_point && email && password) {
            bringUserInfo()
            getInfoFromStorage()
            const response = await api.post('/customers/auth/orderOpen', {
                email, password, id_establishment, id_point
            });
            console.log(response)
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
         getInfoFromStorage()
         bringUserInfo()
         loginApi()
    }, [])
    const DATA = [
        {
            id: '12bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '233ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '33358694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
        {
            id: '333358694a0f-3da1-471f-bd96-145571e329d72',
            title: 'Third Item',
        },
        {
            id: '5658694a0f-3da1-471f-bd96-1425571e29d72',
            title: 'Third Item',
        },
        {
            id: '8958694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ];
    const categories = [
        {
            id: '1',
            name: 'Bebidas',
            icon: 'menu'
        },
        {
            id: '2',
            name: 'Comidas',
            icon: 'menu'
        },
        {
            id: '3',
            name: 'Sobremesas',
            icon: 'menu'
        },
    ]

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30 }}
                    >Restaurantes parceiros:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => { return (<RenderEstablishments title={item.title} />) }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text
                        style={{ fontSize: 30 }}
                    >Promoções:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => { return (<RenderPromos title={item.title} />) }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text
                        style={{ fontSize: 30 }}
                    >Categorias:</Text>
                    <FlatList
                        horizontal={true}
                        data={categories}
                        renderItem={({ item }) => {
                            return (<RenderCategories iconName={item.icon} name={item.name} />)
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text
                        style={{ fontSize: 30 }}
                    >Recomendados:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => { return (<RenderRecomended />) }}
                        keyExtractor={item => item.id}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderedItems: (id) => { dispatch(storeOrderedItems(id)) },
        storeOrderId: (id) => { dispatch(storeOrderId(id)) },
        storeUserInfo: (id) => { dispatch(storeUserInfo(id)) },
    }
}
export default connect(null, mapDispatchToProps)(Home)