
import React, { useEffect, useState } from 'react';
import {
    Text, View, FlatList, Image, Dimensions,
    Modal, TouchableHighlight, TouchableOpacity, Button, Alert, StyleSheet,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux'
import api from '../services/axios';
import Tags from '../components/Tags';
import ProductModal from '../components/Catalog/ProductModal';

import { fetchCatalog, addToCart } from '../actions/cartActions';

const Catalog = (props) => {
    const { route: { params: { data: { id_point, id_establishment } } } } = props;
    const [products, setProducts] = useState([]);
    const [dataToPutOnModal, setDataToPutOnModal] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const handleClick = (_id) => {
        props.addToCart(_id);
    }
    const sendToReducer = (data) => {
        props.fetchCatalog(data);
    }
    const catchDataToPutOnModal = (data) => {
        setDataToPutOnModal(data);
    }
    async function fetchProducts(est, poin) {
        const ctlg = await api.get(`orders/${est}/verify/${poin}`)
        setProducts(ctlg.data.data.catalog);
        sendToReducer(ctlg.data.data.catalog);
    }
    useEffect(() => {
        fetchProducts(id_establishment, id_point);
    }, [])

    function renderItem({ item, index }) {
        const { value } = item;
        const newValue = parseFloat(value).toFixed(2);
        return (
            <>
                <TouchableOpacity key={index} style={{ margin: 1 }}
                    onPress={() => {
                        setModalVisible(true);
                        catchDataToPutOnModal(item);
                    }}
                >
                    <View style={styles.cardContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.imageStyle}
                                source={{
                                    uri: item.photo ?
                                        `http://192.168.15.5:3000/${item.photo}`
                                        : `https://img.elo7.com.br/product/zoom/22565B3/adesivo-parede-prato-comida-frango-salada-restaurante-lindo-adesivo-parede.jpg`
                                }} />
                        </View>
                        <View style={styles.dataContainer}>
                            <View style={{ flex: 2 }}>
                                <ViewWithText flex={1} margin={10} color="grey" text={item.category} />
                                <ViewWithText flex={2} margin={10} fontSize={20} fontStyle="italic" text={item.name} />
                                <ViewWithText flex={1} margin={10} color="grey" text={item.description} />
                            </View>
                            <View style={styles.tagContainer}>
                                <Tags bg="#F49A2C">
                                    0.0
                                </Tags>
                                <Tags bg="#6200ee">
                                    {newValue}
                                </Tags>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={products}
                    renderItem={({ item, index }) => renderItem({ item, index })}
                    keyExtractor={(item, index) => `list-item-${index}`}
                    ListEmptyComponent={<View style={styles.container}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>}
                />
            </View>
            <ProductModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                dataToPutOnModal={dataToPutOnModal}
                handleClick={handleClick}
                total={props.total}
            />
        </SafeAreaView>
    );
}


const ViewWithText = ({ flex, margin, color, fontSize, fontStyle, text }) => {
    return (
        <View style={{ flex: flex, margin: margin }}>
            <Text
                numberOfLines={3}
                ellipsizeMode={"tail"}
                style={{
                    color: color ? color : 'black',
                    fontSize: fontSize ? fontSize : 15,
                    fontStyle: fontStyle ? fontStyle : 'normal'
                }}>{text}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    imageContainer: {
        flex: 1,
        margin: 10
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        borderRadius: 5,
    },
    dataContainer: {
        flex: 2,
        flexDirection: 'row'
    },
    categoryContainer: {
        flex: 1,
        margin: 10
    },
    tagContainer: {
        margin: 10,
        flex: 1, flexDirection: 'column',
        alignItems: 'stretch',
    },
    textStyle: {
        flex: 2,
        justifyContent: 'center'
    },
});
const mapStateToProps = (state) => {
    return {
        items: state.items,
        total: state.total
    }
}
const mapDispatchToProps = (dispatch) => {

    return {
        addToCart: (_id) => { dispatch(addToCart(_id)) },
        fetchCatalog: (data) => { dispatch(fetchCatalog(data)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);