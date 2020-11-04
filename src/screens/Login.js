import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from '../services/authContext';
import api from '../services/axios';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../components/ErrorMessage';
import { storeUserInfo } from '../actions/customerActions';
import { connect, useDispatch } from 'react-redux';
import { handleLogin } from '../utils/login/loginHandler';

const Login = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activityState, setActivityState] = useState(false)
  const storeUserInfoInRedux = (data) => {
    dispatch(storeUserInfo(data));
  };
  const bringUserInfo = async () => {
    const response = await api.get(`/customers/info/${await AsyncStorage.getItem('customer_id')}`);
    const {
      data: {
        data: { customerOrders, customers },
      },
    } = response;
    const { _id, createdAt, email, name, photo } = customers[0];
    storeUserInfoInRedux({
      lastOrders: customerOrders,
      name: name,
      email: email,
      id: _id,
      createdAt: createdAt,
      photo: photo,
    });
  };
  const loginApi = async (email, password) => {
    try {
      setActivityState(true)
      const resLogin = await handleLogin(null, null, email, password, null);
      const { message, success, type } = resLogin
      if (success) {
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        bringUserInfo();
        setTimeout(() => {
          login();
        }, 1000);
      } else {
        setActivityState(false)
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      ToastAndroid.show('Houve um problema ao processar sua requisição,por favor tente novamente mais tarde', ToastAndroid.LONG, ToastAndroid.CENTER);
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .label('Email')
      .email('Digite um email válido')
      .required('É necessário um email para fazer login'),
    password: Yup.string()
      .label('Password')
      .required('O campo "senha" não pode ficar em branco')
      .min(4, 'A senha tem que ter pelo menos 6 caracteres '),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
          loginApi(values.email, values.password);
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          touched,
          handleBlur,
        }) => (
            <View
              style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
              <TextInput
                style={{
                  margin: 15,
                  borderBottomColor: '#6200ee',
                  borderBottomWidth: 1,
                }}
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder="Email"
                autoCapitalize="none"
                onBlur={handleBlur('email')}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <TextInput
                style={{
                  margin: 15,
                  borderBottomColor: '#6200ee',
                  borderBottomWidth: 1,
                }}
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Senha"
                autoCapitalize="none"
                onBlur={handleBlur('password')}
                secureTextEntry={true}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <TouchableOpacity
                style={{
                  height: 60,
                  marginTop: 10,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: !isValid ? 'grey' : '#6200ee',
                  borderRadius: 5,
                  borderColor: 'white',
                  margin: 15,
                }}
                onPress={handleSubmit}
              //disabled={!isValid || isSubmitting}
              >
                {activityState ? <ActivityIndicator size="small" color="white" /> :
                  <Text style={{ color: 'white' }}>Login</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignUp');
                }}
                style={{
                  height: 60,
                  marginTop: 10,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#6200ee',
                  borderRadius: 5,
                  borderColor: 'white',
                  margin: 15,
                }}>
                <Text style={{ color: 'white' }}>
                  Ainda não é cadastrado?Registre-se já!{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </Formik>
    </SafeAreaView>
  );
};

export default connect(null, null)(Login);
