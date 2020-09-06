/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch, connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  removeItem,
  clearCart,
  storeOrderedItems,
  finishOrder
} from './../actions/cartActions';

import AsyncStorage from '@react-native-community/async-storage';
import { renderProducts } from '../components/Cart/RenderProducts';
import CheckoutModal from '../components/Cart/CheckoutModal';
import MyOrdersModal from '../components/Cart/MyOrdersModal';
import PaymentModal from '../components/Cart/PaymentModal';
import HasOrderedArea from './Cart/HasOrderedArea'
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');
const Cart = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [visibilityMyOrders, setVisibilityMyOrders] = useState(false);
  const [visibilityPaymentModal, setVisibilityPaymentModal] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState('');

  const ordered = useSelector((state) => state.cart.orderedItems);
  const items = useSelector((state) => state.cart.addedItems);
  const total = useSelector((state) => state.cart.total);
  const totalCart = useSelector((state) => state.cart.totalCart);
  const dispatch = useDispatch();

  const storeNewOrders = (orders) => {
    dispatch(storeOrderedItems(orders));
  };
  const removeCartItem = (id) => {
    dispatch(removeItem(id));
  };
  const clearTheCart = () => {
    dispatch(clearCart());
  };
  const finishTheOrder = () => {
    dispatch(finishOrder());
  };

  const EmptyCart = () => {
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
  const loadAsyncStorageData = async () => {
    setIsFirstOrder(await AsyncStorage.getItem('isFirstOrder'));
  };
  useEffect(() => {
    loadAsyncStorageData();
  }, [modalVisible, visibilityMyOrders]);
  useEffect(() => { }, [items]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 4 }}>
          <TouchableOpacity
            style={styles.cleanCartButton}
            onPress={() => {
              clearTheCart();
            }}>
            <Text style={{ color: 'white' }}>Limpar carrinho</Text>
          </TouchableOpacity>
          <SafeAreaView style={{ flex: 1 }}>
            {items.length > 0 ? (
              <FlatList
                data={items}
                renderItem={({ item, index }) =>
                  renderProducts({ item, index, removeCartItem })
                }
                keyExtractor={(item, index) => `list-item-${index}`}
                ListEmptyComponent={<EmptyCart />}
              />
            ) : (
                <EmptyCart />
              )}
          </SafeAreaView>
        </View>
        <View style={{ flex: 2 }}>
          {isFirstOrder === 'false' ? (
            <HasOrderedArea
              total={total}
              totalCart={totalCart}
              ordered={ordered}
              setVisibilityMyOrders={setVisibilityMyOrders}
              setVisibilityPaymentModal={setVisibilityPaymentModal}
              setModalVisible={setModalVisible}
              storeNewOrders={storeNewOrders}
            />
          ) : (
              <NoOrdersYetArea
                totalCart={totalCart}
                total={total}
                setModalVisible={setModalVisible}
                clearTheCart={clearTheCart}
                finishTheOrder={finishTheOrder}

              />
            )}
          <CheckoutModal
            items={items}
            total={total}
            totalCart={totalCart}
            modalVisible={modalVisible}
            clearTheCart={clearTheCart}
            storeNewOrders={storeNewOrders}
            setModalVisible={setModalVisible}
          />
          <MyOrdersModal
            items={ordered}
            total={total}
            clearTheCart={clearTheCart}
            storeNewOrders={storeNewOrders}
            visibilityMyOrders={visibilityMyOrders}
            setVisibilityMyOrders={setVisibilityMyOrders}
          />
          <PaymentModal
            visibilityPaymentModal={visibilityPaymentModal}
            setVisibilityPaymentModal={setVisibilityPaymentModal}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const NoOrdersYetArea = (props) => {
  const navigation = useNavigation();
  async function deleteCredentials() {
    await AsyncStorage.removeItem('order_id');
    await AsyncStorage.removeItem('id_establishment');
    await AsyncStorage.removeItem('id_point');
    props.clearTheCart()
    props.finishTheOrder()
    navigation.reset({
      routes: [{ name: 'Home' }]
    })
  }
  return (
    <View style={styles.noOrdersYetContainer}>
      <View style={{ flex: 2 }}>
        {props.total === 0 ? (
          <View style={styles.noOrdersYetView}>
            <Text style={{ color: 'white' }}>Você ainda não fez um pedido!</Text>
          </View>
        ) : (
            <TouchableOpacity
              style={styles.noOrdersYetButton}
              onPress={() => {
                props.setModalVisible(true);
              }}>
              <Text style={{ color: '#6200ee' }}>
                Checkout( R${props.totalCart})
            </Text>
            </TouchableOpacity>
          )}
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.noOrdersYetButton}
          onPress={() => {
            deleteCredentials();
          }}>
          <Text style={{ color: '#6200ee' }}>Sair</Text>
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
export default connect(null, null)(Cart);
