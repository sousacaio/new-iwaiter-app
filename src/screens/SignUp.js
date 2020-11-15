/* eslint-disable */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../services/authContext';
import api from '../services/axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../components/ErrorMessage';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { handleLogin } from '../utils/login/loginHandler';
import { useNavigation } from '@react-navigation/native';
const SignUp = () => {
  const { login } = useAuth();
  const navigation = useNavigation();

  const loginAndGoHome = () => {
    login();
    navigation.navigate('MainTab', {
      name: 'Home',
      params: {},
    });
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .label('Email')
      .email('Digite um email válido')
      .required('É necessário um email válido para se registrar'),
    password: Yup.string()
      .label('Password')
      .required('O campo "senha" não pode ficar em branco')
      .min(4, 'A senha tem que ter pelo menos 6 caracteres '),
    passwordConfirmation: Yup.string()
      .label('passwordConfirmation')
      .required('A confirmação de senha é necessária')
      .min(4, 'A confirmação de senha tem que ter pelo menos 6 caracteres ')
      .test('passwords-match', 'As senhas devem ser iguais', function (value) {
        return this.parent.password === value;
      }),
    name: Yup.string()
      .label('Name')
      .min(1, 'Seu nome deve ter mais de uma letra')
      .required('É necessário um nome válido para se registrar'),
  });

  const register = async (values) => {
    try {
      const res = await api.post('auth/customers/create', values);
      // console.log(JSON.stringify(res, null, '\t'));
      const { data: { response: { message, success, data: data2 } } } = res;
      console.log(success)
      if (success === true) {
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);

        const result = await handleLogin(null, null, data2.email, data2.password, null);

        if (result.type === 'NormalLogin') {
          loginAndGoHome();
        }
      } else {
        console.log('success ta false')
        ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          passwordConfirmation: '',
        }}
        onSubmit={(values) => {
          register(values);
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
            <ScrollView style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
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
                <TextInput
                  style={{
                    margin: 15,
                    borderBottomColor: '#6200ee',
                    borderBottomWidth: 1,
                  }}
                  value={values.passwordConfirmation}
                  onChangeText={handleChange('passwordConfirmation')}
                  placeholder="Confirmação de senha"
                  autoCapitalize="none"
                  onBlur={handleBlur('passwordConfirmation')}
                  secureTextEntry={true}
                />
                <ErrorMessage
                  errorValue={
                    touched.passwordConfirmation && errors.passwordConfirmation
                  }
                />
                <TextInput
                  style={{
                    margin: 15,
                    borderBottomColor: '#6200ee',
                    borderBottomWidth: 1,
                  }}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  placeholder="Nome"
                  autoCapitalize="none"
                  onBlur={handleBlur('name')}
                />
                <ErrorMessage errorValue={touched.name && errors.name} />
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
                  <Text style={{ color: 'white' }}>Registrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
      </Formik>
    </SafeAreaView>
  );
};

export default connect(null, null)(SignUp);
