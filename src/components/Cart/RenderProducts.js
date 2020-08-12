
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import HandleQuantityArea from './HandleQuantity';
const { width, height } = Dimensions.get('screen');

export function renderProducts({ item, index, removeCartItem }) {

    const {
        containerStyle,
        imageStyle,
        imageContainer,
        contentContainer,
        productNameContainer,
        deleteStyle,
        deleteContainer,
        valueStyle
    } = styles;
    return (
        <View style={containerStyle}>
            <View style={imageContainer}>
                <Image
                    resizeMode={'cover'}
                    style={[imageStyle, { borderRadius: 5 }]}
                    source={{
                        uri: item.photo ?
                            `http://192.168.15.5:3000/${item.photo}`
                            : `https://img.elo7.com.br/product/zoom/22565B3/adesivo-parede-prato-comida-frango-salada-restaurante-lindo-adesivo-parede.jpg`
                    }} />
            </View>
            <View style={contentContainer}>
                <View style={productNameContainer}>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Text numberOfLines={2} ellipsizeMode="tail"
                            allowFontScaling={true} style={{ fontStyle: 'italic' }}
                        >{item.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <HandleQuantityArea _id={item._id} quantity={item.quantity} removeCartItem={removeCartItem} />
                    </View>
                    {/* <View style={deleteContainer}>
                        <TouchableOpacity style={deleteStyle} onPress={() => { removeCartItem(item._id) }}  >
                            <Text style={{ color: '#6200ee' }}>X</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'center', }} >
                        <View style={valueStyle}>
                            <Text style={{ fontSize: 15, color: 'white' }}>
                                R${(item.value * item.quantity).toFixed(2)}
                            </Text>
                        </View >
                    </View >
                </View>
            </View>
        </View >);
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#FAFAFA',
        height: height / 5,
        marginTop: 5,
        flexDirection: 'row',
        flex: 1,
        margin: 2,
        borderRadius: 5,
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    imageContainer: {
        flex: 1,
        margin: 10,
        borderRadius: 5
    },
    contentContainer: {
        flex: 2,
        margin: 10
    },
    productNameContainer: {
        flex: 2, margin: 10, flexDirection: 'row'
    },
    deleteContainer: {
        marginTop: 10,
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    deleteStyle: {
        borderWidth: 1,
        borderColor: '#6200ee',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    valueStyle: {
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#6200ee'
    }
});