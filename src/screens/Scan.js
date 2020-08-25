'use strict';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, useSelector } from 'react-redux';

const Scan = (props) => {
    const isFirstOrder = useSelector(state => state.cart.isFirstOrder);
    const orderId = useSelector(state => state.cart.orderId);

    const [shouldRenderCamera, setShouldRenderCamera] = useState(true);
    const navigate = useNavigation();
    const onBarCodeRead = async (barcodes) => {
        if (!barcodes[0].data.match(/errorCode/)) {
            var parametros = barcodes[0].data.split("?")[1];
            var listaDeParametros = parametros.split("&");
            var id_point = listaDeParametros[0].split("=")[1];
            var id_establishment = listaDeParametros[1].split("=")[1];
            console.log("id_point: " + id_point);
            console.log("id_establishment: " + id_establishment);
            setShouldRenderCamera(false);
            await AsyncStorage.setItem('id_establishment', id_establishment);
            await AsyncStorage.setItem('id_point', id_point);
            navigate.navigate('Order', {
                screen: 'Catalog', params: {
                    data:
                        { id_point, id_establishment }
                },
            });
        }

    }
    useEffect(() => {
        if (props && props.route && props.route.params) {
            const { id_establishment, id_point } = props.route.params;
            if (id_establishment && id_point) {
                setShouldRenderCamera(false);
                navigate.navigate('Order', {
                    screen: 'Catalog', params: {
                        data:
                            { id_point, id_establishment }
                    },
                });
            }
        } else {
            setShouldRenderCamera(true)
        }

        return () => {
            console.log('desmontou scan');
        }

    }, []);
    return (
        <View style={styles.container}>
            {shouldRenderCamera ?
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permissão para usar a camera',
                        message: 'Precisamos de sua permissão para acessar a camera e ler os qrcodes',
                        buttonPositive: 'Aceitar',
                        buttonNegative: 'Negar',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => onBarCodeRead(barcodes)}
                /> :
                <View>

                </View>
            }

        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export default Scan;