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
const {width, height} = Dimensions.get('window');
import {connect, useSelector, useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';
import {storeUserInfo} from '../../actions/customerActions';
import {showToastWithGravity} from '../../components/ToastMessages';
import {updateUserAccount} from '../../utils/user/account';

const ChangeNameModal = ({visibilityNameModal, setVisibilityNameModal}) => {
  const id = useSelector((state) => state.customer.id);
  const dispatch = useDispatch();
  const storeUserInfoInRedux = (data) => {
    dispatch(storeUserInfo(data));
  };
  const updateUserInfo = async (data) => {
    storeUserInfoInRedux({
      name: data.name,
      email: data.email,
      id: data._id,
      createdAt: data.createdAt,
      photo: data.photo,
    });
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .label('name')
      .required('O campo "nome" não pode ficar vazio!')
      .min(1, 'O seu nome precisa de pelo menos uma letra!!'),
  });
  const updateName = async (name) => {
    const result = await updateUserAccount('name', name.name, id);
    const {success, newData, message} = result;
    if (success) {
      updateUserInfo(newData);
    }
    setVisibilityNameModal(false);
    showToastWithGravity(message);
  };
  const username = useSelector((state) => state.customer.name);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visibilityNameModal}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Formik
              initialValues={{name: ''}}
              onSubmit={(values) => {
                updateName(values);
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
                    <Text>Nome atual: {username}</Text>
                  </View>
                  <View style={{flex: 1, margin: 10, flexDirection: 'column'}}>
                    <TextInput
                      style={{
                        borderBottomColor: '#6200ee',
                        borderBottomWidth: 1,
                        padding: 10,
                      }}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      placeholder="Novo nome"
                      autoCapitalize="none"
                      onBlur={handleBlur('name')}
                    />
                    <ErrorMessage errorValue={touched.name && errors.name} />
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: !isValid ? 'grey' : '#6200ee',
                        borderRadius: 5,
                        borderColor: 'white',
                      }}
                      onPress={handleSubmit}
                      //disabled={!isValid || isSubmitting}
                    >
                      <Text style={{color: 'white'}}>Atualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#6200ee',
                        borderRadius: 5,
                        borderColor: 'white',
                      }}
                      onPress={() =>
                        setVisibilityNameModal(!visibilityNameModal)
                      }
                      //disabled={!isValid || isSubmitting}
                    >
                      <Text style={{color: 'white'}}>Voltar</Text>
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
export default connect(null, null)(ChangeNameModal);
