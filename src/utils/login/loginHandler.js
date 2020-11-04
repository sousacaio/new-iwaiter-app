import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';

export async function handleLogin(
  id_establishment,
  id_point,
  email,
  password,
  orderId,
) {
  /*primeiro caso:Conferir se o usuário tá logado
   *(email e password)
   */
  console.log(id_establishment, id_point, email, password, orderId)
  if (email && password) {
    //Conferir se tem id do estabelecimento e id da mesa
    //conferir se tem id da ordem ativa
    if (!id_establishment && !id_point && !orderId) {
      const resultNormalLogin = await normalLogin(email, password);
      return resultNormalLogin;
    }
    if (id_establishment && id_point) {
      //ver se tem orderID
      if (orderId) {
        const resultOrderOpenLogin = orderOpenLogin(
          email,
          password,
          id_establishment,
          id_point,
          orderId,
        );
        return resultOrderOpenLogin;
      }
      const resultCatalogOpenLogin = await catalogOpenLogin(
        email,
        password,
        id_establishment,
        id_point,
      );
      return resultCatalogOpenLogin;
    }
  } else {
    //Mandar pra home
    return {
      type: 'goForHome',
    };
  }
}

const orderOpenLogin = async (
  email,
  password,
  id_establishment,
  id_point,
  orderId,
) => {
  try {
    const res = await api.post('/auth/customers/login/orderopen', {
      email,
      password,
      id_establishment,
      id_point,
      id_order: orderId,
    });
    const {
      data: {
        status,
        response: {
          message,
          success,
          data: { customer, token, checkData },
        },
      },
    } = res;
    if (status === 200) {
      let nOrders = [];
      let nIdCheckdata = '';

      if (checkData) {
        const { _id: idCheckData, orders, isClosed, isPaid } = checkData;
        nOrders = orders;
        await AsyncStorage.setItem('order_id', idCheckData);
        await AsyncStorage.setItem('isClosed', JSON.stringify(isClosed));
        await AsyncStorage.setItem('isPaid', JSON.stringify(isPaid));
        await AsyncStorage.setItem('isFirstOrder', 'false');
      } else {
        await AsyncStorage.setItem('isFirstOrder', 'true');
        await AsyncStorage.removeItem('order_id');
      }

      const { _id: idCustomer, name, photo } = customer;
      await AsyncStorage.setItem('name', name);
      if (photo) {
        AsyncStorage.setItem('photo', photo);
      }
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('customer_id', idCustomer);
      return {
        message,
        success,
        type: 'orderOpenLogin',
        orders: nOrders,
        _idCheckdata: nIdCheckdata,
      };
    } else {
      return { message, success, type: 'orderOpenLogin' };
    }
  } catch (error) {
    return {
      message: 'Houve um erro,por favor tente logar novamente!',
      success: false,
      type: 'orderOpenLogin',
      error,
    };
  }
};

const normalLogin = async (email, password) => {
  try {
    const response = await api.post('auth/customers/login', { email, password });
    const {
      data: {
        data: { customer, token },
        message,
        success,
      },
    } = response;
    if (customer && token) {
      const { _id, name, email: newEmail, photo } = customer;
      await AsyncStorage.setItem('email', newEmail);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('password', password);
      if (photo) {
        AsyncStorage.setItem('photo', photo);
      }
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('customer_id', _id);
      return { message, success, type: 'NormalLogin' };
    } else {
      return {
        message: 'Houve um erro,por favor tente logar novamente!',
        success: false,
        type: 'NormalLogin',
      };
    }
  } catch (error) {
    return {
      message: 'Houve um erro,por favor tente logar novamente!',
      success: false,
      type: 'NormalLogin',
      error,
    };
  }
};

const catalogOpenLogin = async (
  email,
  password,
  id_establishment,
  id_point,
) => {
  try {
    const res = await api.post('/auth/customers/login/orderopen', {
      email,
      password,
      id_establishment,
      id_point,
      id_order: null,
    });
    const {
      data: {
        status,
        response: {
          message,
          success,
          data: { customer, token, checkData },
        },
      },
    } = res;
    if (status === 200) {
      let norders = [];
      if (checkData) {
        const { _id: idCheckData, orders, isClosed, isPaid } = checkData;
        await AsyncStorage.setItem('order_id', idCheckData);
        await AsyncStorage.setItem('isClosed', JSON.stringify(isClosed));
        await AsyncStorage.setItem('isPaid', JSON.stringify(isPaid));
        await AsyncStorage.setItem('isFirstOrder', 'false');
        norders = orders;
      } else {
        await AsyncStorage.setItem('isFirstOrder', 'true');
        await AsyncStorage.removeItem('order_id');
      }

      const { _id, name, photo } = customer;
      await AsyncStorage.setItem('name', name);
      if (photo) {
        AsyncStorage.setItem('photo', photo);
      }
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('customer_id', _id);
      return { message, success, type: 'catalogOpenLogin', orders: norders, _id };
    } else {
      return { message, success, type: 'catalogOpenLogin' };
    }
  } catch (error) {
    return {
      message: 'Houve um erro,por favor tente logar novamente!',
      success: false,
      type: 'catalogOpenLogin',
      error,
    };
  }
};
