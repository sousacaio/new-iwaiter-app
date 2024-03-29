import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch, connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { storeOrderedItems } from '../../actions/cartActions';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/axios';

import { checkOrderStatus } from '../../utils/cart/cart';

const { height } = Dimensions.get('screen');
const HasOrderedArea = (props) => {
  const [idEst, setIdEst] = useState();
  const stateOrders = useSelector((state) => state.cart.orderedItems);
  const cartState = useSelector((state) => state.cart);
  const stateCart = useSelector((state) => state.cart.addedItems);
  const badgeConfirmed = stateOrders.filter((item) => item.confirmed === 1);
  const badgeCanceled = stateOrders.filter((item) => item.confirmed === 2);
  const badgeWaiting = stateOrders.filter((item) => item.confirmed === 0);
  const valores = props.ordered.map((item) => {
    if (item.confirmed === 1) {
      return item.value * item.quantity;
    } else {
      return 0;
    }
  });
  const valoresCart = stateCart.map((item) => {
    if (item !== undefined) {
      return item.value * item.quantity;
    } else {
      return 0;
    }
  });
  const unscrambleAdded = valoresCart[0];
  let unscrambleOrdered = 0;
  valoresCart
    ? (unscrambleOrdered = valores.reduce((a, b) => a + b, 0))
    : (unscrambleOrdered = 0);
  const confirmedItens = stateOrders.filter((item) => {
    return item.confirmed !== 0;
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orderId = useSelector((state) => state.cart.orderId);
  const customerId = useSelector((state) => state.customer.id);

  const storeNewOrders2 = (orders) => {
    dispatch(storeOrderedItems(orders));
  };
  const checkData = async () => {
    const result = await checkOrderStatus(orderId);
    const {success, message, orders} = result;
    storeNewOrders2(orders);
    if (success) {
      console.log(JSON.stringify(result, null, '\t'));
      props.clearTheCart();
      props.finishTheOrder();
      Alert.alert(message);
      navigation.navigate('Scan');
    } else {
      Alert.alert('Erro!', message);
    }
    // try {
    //   const res = await api.get(`orders/getById/${orderId}`);
    //   console.log(JSON.stringify(res, null, '\t'));
    //   const {
    //     data: {
    //       status,
    //       message,
    //       response: {
    //         data: { orders },
    //       },
    //     },
    //   } = res;
    //   storeNewOrders2(orders);
    //   console.log(JSON.stringify(res, null, '\t'));
    //   if (status === 200) {
    //     const checkActualizedOrders = orders.filter((item) => {
    //       return item.confirmed !== 0;
    //     });
    //     if (checkActualizedOrders.length > 0) {
    //       Alert.alert(
    //         'Cancelamento não é possível',
    //         'Um dos seus pedidos já foi confirmado ou está em espera.',
    //       );
    //     } else {
    //       const res = await api.post(
    //         `orders/${orderId}/cancelOrder/${idEst}/${customerId}`,
    //       );
    //       const {
    //         data: { message, status },
    //       } = res;
    //       if (status === 200) {
    //         if (cartState.isFirstOrder === false) {
    //           await AsyncStorage.removeItem('order_id');
    //           await AsyncStorage.removeItem('id_establishment');
    //           await AsyncStorage.removeItem('id_point');
    //           await AsyncStorage.removeItem('isFirstOrder');
    //           props.clearTheCart();
    //           props.finishTheOrder();
    //           navigation.navigate('Scan');
    //         }
    //       } else {
    //       }
    //     }
    //   } else {
    //     Alert.alert('Erro', message);
    //   }
    // } catch (error) {
    //   console.log(JSON.stringify(error, null, '\t'));
    // }
  };

  async function getAsyncData() {
    setIdEst(await AsyncStorage.getItem('id_establishment'));
  }

  useEffect(() => {
    getAsyncData();
  }, []);

  return (
    <View style={styles.noOrdersYetContainer}>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setVisibilityMyOrders(true);
            }}>
            <Text style={{ color: '#6200ee' }}> Comanda </Text>
            <View
              style={[
                styles.tabBadge,
                { backgroundColor: '#6200ee', right: 10 },
              ]}>
              <Text style={styles.tabBadgeText}>{badgeWaiting.length}</Text>
            </View>
            <View
              style={[styles.tabBadge, { backgroundColor: 'red', right: 40 }]}>
              <Text style={styles.tabBadgeText}>{badgeCanceled.length}</Text>
            </View>
            <View
              style={[styles.tabBadge, { backgroundColor: 'green', right: 70 }]}>
              <Text style={styles.tabBadgeText}>{badgeConfirmed.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {confirmedItens.length === 0 ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.noOrdersYetButton}
              onPress={() => checkData()}>
              <Text style={{ color: 'green' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
            <View />
          )}

        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Aqui vai vir o total do carrinho */}
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setModalVisible(true);
            }}>
            <Text style={{ color: '#6200ee' }}>
              Carrinho(R$ {props.totalCart.toFixed(2)})
            </Text>
          </TouchableOpacity>
          {/* Aqui vai vir o total do carrinho + o q ja foi pedido */}
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              confirmedItens.length === 0
                ? Alert.alert('Nenhum dos seus pedidos foi atendido')
                : props.setVisibilityPaymentModal(true);
            }}>
            <Text style={{ color: '#6200ee' }}>
              {' '}
              Fechar(R${' '}
              {props.ordered.length > 0
                ? (
                  unscrambleOrdered + (unscrambleAdded ? unscrambleAdded : 0)
                ).toFixed(2)
                : 0}
              )
            </Text>
          </TouchableOpacity>
        </View>
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
  tabContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: 5,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default connect(null, null)(HasOrderedArea);
