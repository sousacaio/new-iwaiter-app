import React from 'react';
import {
  Text,
  View,
  Dimensions,
  Modal,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import IconButton from '../IconButton';
import { connect, useSelector, useDispatch } from 'react-redux';
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { finishOrder } from '../../actions/cartActions';
const PaymentModal = ({ visibilityPaymentModal, setVisibilityPaymentModal }) => {
  const orderIdRedux = useSelector((state) => state.cart.orderId);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const resetReduxStateCart = () => {
    dispatch(finishOrder());
  };
  async function deleteCredentials() {
    await AsyncStorage.removeItem('order_id');
    await AsyncStorage.removeItem('id_establishment');
    await AsyncStorage.removeItem('id_point');
    await AsyncStorage.removeItem('isFirstOrder');
    resetReduxStateCart();
    console.log(cart);
  }
  const endOrder = async (paymentMethod) => {
    console.log('idorder:' + orderIdRedux);
    console.log('paymentMethod:' + paymentMethod);
    try {
      const res = await api.post(
        `orders/endOrder/${orderIdRedux}/${paymentMethod}`,
      );
      console.log(res)
      const {
        data: { response, status, message },
      } = res;
      if (status === 200) {
        const {
          data: { isClosed },
        } = response;
        if (isClosed === true) {
          Alert.alert(
            'Pagamento',
            message,
            [
              {
                text: 'OK',
                onPress: () => {
                  setVisibilityPaymentModal(!visibilityPaymentModal);
                  deleteCredentials();
                  navigation.navigate('Scan');
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          ToastAndroid.show(
            'Seu pedido para fechamento de comanda não foi processado,tente novamente',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      } else {
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    } catch (error) {
      Alert.alert(
        'Pagamento',
        'Por favor,dirija-se ao caixa',
        [
          {
            text: 'OK',
            onPress: () => {
              setVisibilityPaymentModal(!visibilityPaymentModal);
              deleteCredentials();
              navigation.navigate('Scan');
            },
          },
        ],
        { cancelable: false },
      );
    }

  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibilityPaymentModal}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.nameContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.nameText}>
                Método de pagamento:
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <IconButton
                  onPress={() => endOrder('Dinheiro')}
                  borderColor="green"
                  name="money"
                  color="green"
                  text="Dinheiro"
                />
                <IconButton
                  onPress={() => endOrder('Credito')}
                  borderColor="black"
                  name="credit-card"
                  color="black"
                  text="Crédito"
                />
                <IconButton
                  onPress={() => endOrder('Debito')}
                  borderColor="black"
                  name="credit-card"
                  color="black"
                  text="Débito"
                />
              </View>
              <View />
            </View>
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButton
                onPress={() => setVisibilityPaymentModal(false)}
                borderColor="purple"
                name="undo"
                color="purple"
                text="Voltar ao carrinho"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'space-around',
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
export default connect(null, null)(PaymentModal);
