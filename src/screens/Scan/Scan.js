'use strict';
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const Scan = (props) => {
  const isFirstOrder = useSelector((state) => state.cart.isFirstOrder);

  const [shouldRenderCamera, setShouldRenderCamera] = useState(true);
  const [credentials, setCredencials] = useState({ idEst: '', idPoint: '' });
  const loadCredentials = async () => {
    const idEstStorage = await AsyncStorage.getItem('id_establishment');
    const idPointStorage = await AsyncStorage.getItem('id_point');
    setCredencials({ idEst: idEstStorage, idPoint: idPointStorage });
  }


  const navigation = useNavigation();
  const onBarCodeRead = async (barcodes) => {
    if (shouldRenderCamera === true) {
      if (!barcodes[0].data.match(/errorCode/)) {
        var parametros = barcodes[0].data.split('?')[1];
        var listaDeParametros = parametros.split('&');
        var id_point = listaDeParametros[0].split('=')[1];
        var id_establishment = listaDeParametros[1].split('=')[1];
        setShouldRenderCamera(false);
        await AsyncStorage.setItem('id_establishment', id_establishment);
        await AsyncStorage.setItem('id_point', id_point);
        navigation.navigate('Order', {
          screen: 'Catalog',
          params: {
            data: { id_point, id_establishment },
          },
        });
        setShouldRenderCamera(true);
      }
    }else{
      console.log('n deveia renderizar isso')
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.addListener('focus', () => {
        loadCredentials();
        if (props && props.route && props.route.params) {
          const { id_establishment, id_point } = props.route.params;
          if (id_establishment && id_point) {
            setShouldRenderCamera(false);
            navigation.navigate('Order', {
              screen: 'Catalog',
              params: {
                data: { id_point, id_establishment },
              },
            });
          }
        } else {
          if (credentials.idEst && credentials.idPoint) {
            setShouldRenderCamera(false);
            navigation.navigate('Order', {
              screen: 'Catalog',
              params: {
                data: {
                  id_point: credentials.idPoint,
                  id_establishment: credentials.idEst,
                },
              },
            });
          } else {
            console.log('n achou nd pra dar fetch');
            setShouldRenderCamera(true);
          }
        }
      });

      return () => {
        console.log('desfocada');
        setShouldRenderCamera(true);
      };
    }, [navigation]),
  );

  const renderCamera = () => {
    return (
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permissão para usar a camera',
          message:
            'Precisamos de sua permissão para acessar a camera e ler os qrcodes',
          buttonPositive: 'Aceitar',
          buttonNegative: 'Negar',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) =>
          onBarCodeRead(barcodes)
        }
      />
    )
  }
  return (
    <View style={styles.container}>
      {shouldRenderCamera ? (
        renderCamera()
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
    </View>
  );
};

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

export default connect(null, null)(Scan);
