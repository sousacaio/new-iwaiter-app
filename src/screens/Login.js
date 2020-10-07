import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth} from '../services/authContext';
import api from '../services/axios';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../components/ErrorMessage';
import {storeUserInfo} from '../actions/customerActions';
import {connect, useDispatch} from 'react-redux';

const Login = () => {
  const {login} = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const storeUserInfoInRedux = (data) => {
    dispatch(storeUserInfo(data));
  };
  const bringUserInfo = async () => {
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
  };
  const loginApi = async (email, password) => {
    try {
      await api
        .post('/auth/customers/login', {email, password})
        .then(async (response) => {
          if (response) {
            await AsyncStorage.setItem('email', email);
            AsyncStorage.setItem('password', password);
            const {
              data: {
                data: {
                  token,
                  customer: {_id, name, photo},
                },
              },
            } = response;

            AsyncStorage.setItem('name', name);
            if (photo) {
              AsyncStorage.setItem('photo', photo);
            }
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('customer_id', _id);
            bringUserInfo();
            setTimeout(() => {
              login();
            }, 1000);
          }
        })
        .catch(function (error) {});
    } catch (error) {}
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
    <SafeAreaView style={{flex: 1}}>
      <Formik
        initialValues={{email: '', password: ''}}
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
            style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
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
              <Text style={{color: 'white'}}>Login</Text>
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
              <Text style={{color: 'white'}}>
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
