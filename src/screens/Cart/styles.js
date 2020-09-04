/* eslint-disable */
import React from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
export const EmptyCart = () => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
            }}>
            <Text>Carrinho vazio</Text>
        </View>
    );
};
export const Container = (props) => {
    return (
        <View
            style={{
                flex: props.flex
            }}>
            {props.children}
        </View>
    );
};

