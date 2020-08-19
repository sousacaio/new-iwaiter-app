import React, { useEffect } from 'react';
import {
    Dimensions,
    View, Text,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import MailIcon from 'react-native-vector-icons/Fontisto';
import Pass from 'react-native-vector-icons/Entypo';
import Edit from 'react-native-vector-icons/Feather';
import Name from 'react-native-vector-icons/AntDesign';
import { connect, useSelector } from 'react-redux';
import { storeOrderedItems, storeOrderId } from '../../actions/cartActions';
import { useAuth } from '../../services/authContext';
const { width } = Dimensions.get('window')

const Acount = () => {
    const { singOut } = useAuth();
    const email = useSelector(state => state.customer.email);
    const name = useSelector(state => state.customer.name);
    const photo = useSelector(state => state.customer.photo);
    const isThereAnActiveOrder = useSelector(state => state.cart.orderId);
    const handleLogout = async () => {
        await AsyncStorage.clear()
        singOut();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, backgroundColor: '#6200ee', margin: 10, borderRadius: 10, justifyContent: 'center' }}>
                <View style={{
                    flex: 5,
                    margin: 10,
                    borderRadius: 5
                }}>
                    <Image
                        resizeMode={'cover'}
                        style={{
                            flex: 1,
                            width: undefined,
                            height: undefined,
                            borderRadius: 5
                        }}
                        source={{
                            uri: photo ?
                                `http://192.168.15.5:3000/${photo}`
                                : `https://img.elo7.com.br/product/zoom/22565B3/adesivo-parede-prato-comida-frango-salada-restaurante-lindo-adesivo-parede.jpg`
                        }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>(Clique na sua foto para trocá-la) </Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-between', margin: 15 }}>
                        <View >
                            <Name name="profile" size={30} color="#6200ee" />
                        </View>
                        <View >
                            <Text>{name}</Text>
                        </View>
                        <View >
                            <Edit name="edit" size={30} color="#6200ee" />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-between', margin: 15 }}>
                        <View>
                            <MailIcon name="email" size={30} color="#6200ee" />
                        </View>
                        <View >
                            <Text>{email}</Text>
                        </View>
                        <View >
                            <Edit name="edit" size={30} color="#6200ee" />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-between', margin: 15 }}>
                        <View>
                            <Pass name="key" size={30} color="#6200ee" />
                        </View>
                        <View >
                            <Text>*************</Text>
                        </View>
                        <View >
                            <Edit name="edit" size={30} color="#6200ee" />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'center', margin: 15 }}>
                        {isThereAnActiveOrder ?
                            <TouchableOpacity
                                style={{
                                    width: width / 1.2,
                                    margin: 10,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'grey',
                                    borderRadius: 5,
                                    borderColor: 'white',
                                    margin: 15
                                }}
                            //disabled={!isValid || isSubmitting}
                            >
                                <Text style={{ color: 'white' }}> Você não pode deslogar com uma comanda ativa! </Text>
                            </TouchableOpacity>

                            :
                            <TouchableOpacity
                                style={{
                                    width: width / 1.5,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#6200ee',
                                    borderRadius: 5,
                                    borderColor: 'white',
                                    margin: 15
                                }}
                                onPress={() => handleLogout()}
                            //disabled={!isValid || isSubmitting}
                            >
                                <Text style={{ color: 'white' }}>
                                    Logout
                            </Text>
                            </TouchableOpacity>

                        }


                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default connect(null, null)(Acount)