import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {height} = Dimensions.get('screen');
import AsyncStorage from '@react-native-community/async-storage';

const NoOrdersYetArea = (props) => {
  const navigation = useNavigation();
  async function deleteCredentials() {
    await AsyncStorage.removeItem('order_id');
    await AsyncStorage.removeItem('id_establishment');
    await AsyncStorage.removeItem('id_point');

    props.clearTheCart();
    props.finishTheOrder();

    navigation.navigate('Scan');
  }
  return (
    <View style={styles.noOrdersYetContainer}>
      <View style={{flex: 2}}>
        {props.total === 0 ? (
          <View style={styles.noOrdersYetView}>
            <Text style={{color: 'white'}}>Você ainda não fez um pedido!</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setModalVisible(true);
            }}>
            <Text style={{color: '#6200ee'}}>
              Checkout( R${props.totalCart})
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.noOrdersYetButton}
          onPress={() => {
            deleteCredentials();
          }}>
          <Text style={{color: '#6200ee'}}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  noOrdersYetContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#6200ee',
  },
  noOrdersYetView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noOrdersYetButton: {
    flex: 1,
    marginTop: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'white',
    margin: 10,
  },
  cleanCartButton: {
    height: height / 9,
    marginTop: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 5,
    borderColor: 'white',
    margin: 10,
  },
});
export default NoOrdersYetArea;
