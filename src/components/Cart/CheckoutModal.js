import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, useDispatch, useSelector } from 'react-redux';
import { storeOrderId } from '../../actions/cartActions';
import AntiIcon from 'react-native-vector-icons/AntDesign';
import MaterialComunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNewOrder } from '../../utils/cart/cart';
const CheckoutModal = ({
  modalVisible,
  total,
  setModalVisible,
  items,
  clearTheCart,
  storeNewOrders,
}) => {
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [point, setPoint] = useState('');
  const [isFirstOrder, setIsFirstOrder] = useState('');
  const [orderId, setOrderId] = useState('');
  const cartState = useSelector(state => state.cart)
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
  const loadCredentials = async () => {
    setCustomer(await AsyncStorage.getItem('customer_id'));
    setPoint(await AsyncStorage.getItem('id_point'));
    setEstablishment(await AsyncStorage.getItem('id_establishment'));
    setIsFirstOrder(await AsyncStorage.getItem('isFirstOrder'));
    setOrderId(await AsyncStorage.getItem('order_id'));
  };
  const dispatchOrder = (data) => {
    dispatch(storeOrderId(data));
  };
  useEffect(() => {
    loadCredentials();
  }, [modalVisible]);
  const transformIdItems = (itemsFromCart) => {
    const newItemsFromCart = itemsFromCart.map((item) => {
      const idProduct = item._id;
      return {...item, id_product: idProduct};
    });
    return newItemsFromCart;
  };
  const createOrder = async () => {
    try {
      const newItems = transformIdItems(items);
      const result = await createNewOrder(
        newItems,
        customer,
        establishment,
        point,
      );
      console.log(JSON.stringify(result, null, '\t'))
      const {idOrder, orders, message} = result;
      if (idOrder && orders) {
        dispatchOrder(idOrder);
        setOrderId(idOrder);
        setModalVisible(false);
        storeNewOrders(orders);
        ToastAndroid.show(
          'Pedido efetuado com sucesso!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newRequest = async () => {
    const itemsCopy = items;
    const newItems = transformIdItems(itemsCopy);
    const res = await api.post(`orders/${orderId}/request`, newItems);
    const {
      data: { response, status, message },
    } = res;
    if (status === 201) {
      ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      const {
        data: { orders },
      } = response;
      setModalVisible(false);
      storeNewOrders(orders);
      clearTheCart();
    } else {
      ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      setModalVisible(false);
    }
  };

  const renderOrderedItems = (item, index) => {
    return (
      <View style={styles.cardItemContainer}>
        <View style={styles.cardItemHeader}>
          <Text style={{ fontSize: 20, color: 'black' }}>{item.name}</Text>
        </View>

        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <AntiIcon name="shoppingcart" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Quantidade:</Text>
            </View>
          </View>

          <View>
            <Text style={styles.fontStyle}>{item.quantity}</Text>
          </View>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <MaterialComunity name="dice-1" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Unidade:</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fontStyle}>
              R$ {parseFloat(item.value).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <MaterialComunity name="dice-multiple" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Total:</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fontStyle}>
              R$ {parseFloat(item.value * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.nameContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.nameText}>
                Checkout
              </Text>
            </View>
          </View>
          <View style={{ flex: 4 }}>
            <View style={{ flex: 3, marginTop: 10 }}>
              <SafeAreaView>
                {items.length > 0 ? (
                  <FlatList
                    data={items}
                    renderItem={({ item, index }) =>
                      renderOrderedItems(item, index)
                    }
                    keyExtractor={(item, index) => `list-item-${index}`}
                    ListEmptyComponent={<EmptyCart />}
                  />
                ) : (
                    <EmptyCart />
                  )}
              </SafeAreaView>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#FCFCFC',
                borderTopLeftRadius: 20,
                borderTopRigthRadius: 20,
              }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    adjus
                    tsFontSizeToFit={true}
                    style={{ color: '#A6A6A6', fontSize: 30 }}>
                    {' '}
                    Total
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{ color: 'black', fontSize: 30 }}>
                    {' '}
                    R$ {total}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'stretch' }}>
                {items.length > 0 ? (
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                      isFirstOrder === 'false' ? newRequest() : createOrder();
                    }}>
                    <Text
                      adjustsFontSizeToFit={true}
                      style={{
                        color: 'white',
                      }}>
                      {'Fechar pedido'}{' '}
                    </Text>
                  </TouchableOpacity>
                ) : (
                    <View />
                  )}

                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      color: 'white',
                    }}>
                    {'Voltar para o carrinho'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },

  imageStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  image: {
    width: width / 1.2,
    height: height / 2,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 5,
  },
  contentContainer: {
    flex: 1,
    margin: 10,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 30,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#6200ee',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  cardItemContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    margin: 10,
    borderColor: '#7D7D7D',
    borderRadius: 5,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  cardItemHeader: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopColor: '#7D7D7D',
    borderBottomColor: '#7D7D7D',
    borderLeftColor: '#FAFAFA',
    borderRightColor: '#FAFAFA',
    borderWidth: 0.5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardItemIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  cardItemSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderTopColor: '#7D7D7D',
    borderBottomColor: '#7D7D7D',
    borderLeftColor: '#FAFAFA',
    borderRightColor: '#FAFAFA',
    borderWidth: 0.5,
    justifyContent: 'space-between',
    padding: 10,
  },
  fontStyle: {
    color: '#7D7D7D',
    fontSize: 20,
    fontWeight: '400',
  },
});
export default connect(null, null)(CheckoutModal);

// <View
// style={{
//     flex: 1,
//     backgroundColor: '#FAFAFA',
//     margin: 10,
//     borderColor: '#6200ee',
//     borderBottomWidth: 6,
//     borderRadius: 5,
//     padding: 10,
// }}>
// <View
//     style={{
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         borderBottomWidth: 1,
//         borderColor: '#6200ee',
//     }}>
//     <View
//         style={{
//             flex: 1,
//             alignContent: 'center',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//         <Text style={{ fontSize: 20 }}>Status</Text>
//     </View>
//     <View
//         style={{
//             flex: 1,
//             alignContent: 'center',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//         <Text style={{ fontSize: 20 }}>{item.quantity}x</Text>
//     </View>
//     <View
//         style={{
//             flex: 2,
//             alignContent: 'center',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//         <Text style={{ fontSize: 20 }}>{item.name}</Text>
//     </View>
// </View>
// <View style={{ flex: 1, flexDirection: 'row' }}>
//     <View
//         style={{
//             flex: 1,
//             alignContent: 'center',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//         <Tags bg="#6200ee">
//             <View
//                 style={{
//                     flex: 1,
//                     alignContent: 'center',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}>
//                 <Text style={{ fontSize: 20, color: 'white' }}>
//                     Unidade
// </Text>
//                 <Text style={{ fontSize: 20, color: 'white' }}>
//                     R${parseFloat(item.value).toFixed(2)}
//                 </Text>
//             </View>
//         </Tags>
//     </View>
//     <View
//         style={{
//             flex: 1,
//             alignContent: 'center',
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//         <Tags bg="#6200ee">
//             <View
//                 style={{
//                     flex: 1,
//                     alignContent: 'center',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}>
//                 <Text style={{ fontSize: 20, color: 'white' }}>
//                     Total do item:
// </Text>
//                 <Text style={{ fontSize: 20, color: 'white' }}>
//                     R$
// {parseFloat(
//                     item.value * item.quantity,
//                 ).toFixed(2)}{' '}
//                 </Text>
//             </View>
//         </Tags>
//     </View>
// </View>
// </View>
