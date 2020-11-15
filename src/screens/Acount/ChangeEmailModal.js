import React from 'react';
import {
  Text,
  View,
  Dimensions,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { connect, useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';
import { storeUserInfo } from '../../actions/customerActions';
import { showToastWithGravity } from '../../components/ToastMessages';
import { updateUserAccount } from '../../utils/user/account';

const ChangeEmailModal = ({ visibilityEmailModal, setVisibilityEmailModal }) => {
  const id = useSelector((state) => state.customer.id);
  const dispatch = useDispatch();
  const storeUserInfoInRedux = (data) => {
    dispatch(storeUserInfo(data));
  };
  const updateUserInfo = async (data) => {
    storeUserInfoInRedux({
      lastOrders: [],
      name: data.name,
      email: data.email,
      id: data._id,
      createdAt: data.createdAt,
      photo: data.photo,
    });
  };
  const updateEmail = async (data) => {
    const result = await updateUserAccount('email', data.email, id);
    const { success, newData, message } = result;
    if (success) {
      updateUserInfo(newData);
    }
    setVisibilityEmailModal(false);
    showToastWithGravity(message);
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .label('email')
      .email('Insira um e-mail válido!')
      .required('O campo "email" não pode ficar vazio!'),
  });
  const useremail = useSelector((state) => state.customer.email);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visibilityEmailModal}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Formik
              initialValues={{ email: '' }}
              onSubmit={(values) => {
                updateEmail(values);
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
                  <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                      <Text>Email atual: {useremail}</Text>
                    </View>
                    <View style={styles.emailView}>
                      <TextInput
                        style={styles.textInputStyle}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        placeholder="Novo email"
                        autoCapitalize="none"
                        onBlur={handleBlur('email')}
                      />
                      <ErrorMessage errorValue={touched.email && errors.email} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={[
                          styles.buttonStyle,
                          {
                            backgroundColor: !isValid ? 'grey' : '#6200ee',
                          },
                        ]}
                        onPress={handleSubmit}>
                        <Text style={{ color: 'white' }}>Atualizar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() =>
                          setVisibilityEmailModal(!visibilityEmailModal)
                        }>
                        <Text style={{ color: 'white' }}>Voltar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </Formik>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomColor: '#6200ee',
    borderBottomWidth: 1,
    padding: 10,
  },
  emailView: {
    flex: 1,
    margin: 10,
    flexDirection: 'column',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: width / 1.2,
    height: height / 2,
    margin: 90,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  headerContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 5,
    borderColor: 'white',
  },
});
export default connect(null, null)(ChangeEmailModal);
