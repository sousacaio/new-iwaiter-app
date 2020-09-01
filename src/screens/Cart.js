/* eslint-disable */
import React, {useEffect, useState} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  addQuantity,
  subtractQuantity,
  removeItem,
  clearCart,
  storeOrderedItems,
} from './../actions/cartActions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {renderProducts} from '../components/Cart/RenderProducts';
import CheckoutModal from '../components/Cart/CheckoutModal';
import Reactotron from 'reactotron-react-native';
import MyOrdersModal from '../components/Cart/MyOrdersModal';
import PaymentModal from '../components/Cart/PaymentModal';

const {width, height} = Dimensions.get('screen');
const Cart = (props) => {
  Reactotron.log('cart props');
  Reactotron.log(props);
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
  useEffect(() => {}, [items]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 4}}>
          <TouchableOpacity
            style={styles.cleanCartButton}
            onPress={() => {
              clearTheCart();
            }}>
            <Text style={{color: 'white'}}>Limpar carrinho</Text>
          </TouchableOpacity>
          <SafeAreaView style={{flex: 1}}>
            {items.length > 0 ? (
              <FlatList
                data={items}
                renderItem={({item, index}) =>
                  renderProducts({item, index, removeCartItem})
                }
                keyExtractor={(item, index) => `list-item-${index}`}
                ListEmptyComponent={<EmptyCart />}
              />
            ) : (
              <EmptyCart />
            )}
          </SafeAreaView>
        </View>
        <View style={{flex: 2}}>
          {isFirstOrder === 'false' ? (
            <HasOrderedArea
              total={total}
              totalCart={totalCart}
              ordered={ordered}
              setVisibilityMyOrders={setVisibilityMyOrders}
              setVisibilityPaymentModal={setVisibilityPaymentModal}
              setModalVisible={setModalVisible}
            />
          ) : (
            <NoOrdersYetArea
              totalCart={totalCart}
              total={total}
              setModalVisible={setModalVisible}
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

const HasOrderedArea = (props) => {
  const ordersLength = props.ordered.length;
  const somar = (acumulado, x) => acumulado + x;
  const valores = props.ordered.map((item) => {
    if (item.confirmed === 1) {
      return item.value * item.quantity;
    } else {
      return 0;
    }
  });
  return (
    <View style={styles.noOrdersYetContainer}>
      <View style={{flex: 2}}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setVisibilityMyOrders(true);
            }}>
            <Text style={{color: '#6200ee'}}>Meus Pedidos({ordersLength})</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {/* Aqui vai vir o total do carrinho */}
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setModalVisible(true);
            }}>
            <Text style={{color: '#6200ee'}}>
              Carrinho(R$ {props.totalCart.toFixed(2)})
            </Text>
          </TouchableOpacity>
          {/* Aqui vai vir o total do carrinho + o q ja foi pedido */}
          <TouchableOpacity
            style={styles.noOrdersYetButton}
            onPress={() => {
              props.setVisibilityPaymentModal(true);
            }}>
            <Text style={{color: '#6200ee'}}>
              Fechar(R${' '}
              {props.ordered.length > 0
                ? (valores.reduce(somar) + props.total).toFixed(2)
                : 0}
              )
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const NoOrdersYetArea = (props) => {
  async function deleteCredentials() {
    await AsyncStorage.removeItem('order_id');
    await AsyncStorage.removeItem('id_establishment');
    await AsyncStorage.removeItem('id_point');
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
export default connect(null, null)(Cart);
