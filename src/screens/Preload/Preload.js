import React, {useEffect} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth} from '../../services/authContext';
import api from '../../services/axios';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {storeOrderedItems, storeOrderId} from '../../actions/cartActions';
import {storeUserInfo} from '../../actions/customerActions';
import Icon from 'react-native-vector-icons/Entypo';
import {handleLogin} from '../../utils/login/loginHandler';

const Preload = (props) => {
  const {login} = useAuth();
  const navigation = useNavigation();
  const storeUserInfoInRedux = (data) => {
    props.storeUserInfo(data);
  };

  const bringUserInfo = async () => {
    try {
      const response = await api.get(
        `/customers/info/${await AsyncStorage.getItem('customer_id')}`,
      );

      const {
        data: {
          data: {customerOrders, customers},
        },
      } = response;
      const {_id, createdAt, email, name, photo} = customers[0];
      storeUserInfoInRedux({
        lastOrders: customerOrders,
        name: name,
        email: email,
        id: _id,
        createdAt: createdAt,
        photo: photo,
      });
    } catch (error) {}
  };
  const storeOrderItems = (data) => {
    props.storeOrderedItems(data);
  };
  const storeOrderIdRedux = (data) => {
    props.storeOrderId(data);
  };
  const loginAndGoHome = () => {
    login();
    navigation.navigate('MainTab', {
      name: 'Home',
      params: {},
    });
  };

  const loginApi = async () => {
    const id_establishment = await AsyncStorage.getItem('id_establishment');
    const id_point = await AsyncStorage.getItem('id_point');
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const orderId = await AsyncStorage.getItem('order_id');

    const result = await handleLogin(
      id_establishment,
      id_point,
      email,
      password,
      orderId,
    );

    if (result.type === 'orderOpenLogin') {
      storeOrderItems(result.orders);
      storeOrderIdRedux(result._idCheckdata);
      loginAndGoHome();
    }

    if (result.type === 'catalogOpenLogin') {
      loginAndGoHome();
    }

    if (result.type === 'NormalLogin') {
      loginAndGoHome();
    }
    if (result.type === 'goForHome') {
      navigation.navigate('MainTab', {
        name: 'Home',
        params: {},
      });
    }
  };

  async function getInfoFromStorage() {
    AsyncStorage.getAllKeys((_err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((_result, i, store) => {
          console.log({[store[i][0]]: store[i][1]});
          return true;
        });
      });
    });
  }

  useEffect(() => {
    getInfoFromStorage();
    bringUserInfo();
    loginApi();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#6200ee'}}>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="drink" size={80} color="white" />
          <Text style={{fontSize: 30, color: 'white'}}>iWaiter</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    storeOrderedItems: (id) => {
      dispatch(storeOrderedItems(id));
    },
    storeOrderId: (id) => {
      dispatch(storeOrderId(id));
    },
    storeUserInfo: (id) => {
      dispatch(storeUserInfo(id));
    },
  };
};
export default connect(null, mapDispatchToProps)(Preload);
