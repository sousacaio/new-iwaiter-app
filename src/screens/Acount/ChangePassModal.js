import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Dimensions, Modal,
    StyleSheet,
    Alert,
    TextInput,
    TouchableOpacity
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { connect, useSelector, useDispatch } from 'react-redux'
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup'
import ErrorMessage from '../../components/ErrorMessage';
import { storeUserInfo } from '../../actions/customerActions';
import { showToastWithGravity } from '../../components/ToastMessages'
import CheckBox from '@react-native-community/checkbox';

const ChangePassModal = ({ visibilityPassModal, setVisibilityPassModal }) => {
    const [showPass, setShowPass] = useState(true)
    const id = useSelector(state => state.customer.id);
    const dispatch = useDispatch();
    const storeUserInfoInRedux = (data) => {
        dispatch(storeUserInfo(data))
    }
    const updateUserInfo = async (data) => {
        storeUserInfoInRedux({
            name: data.name,
            email: data.email,
            id: data._id,
            createdAt: data.createdAt,
            photo: data.photo
        })
    }
    const updatePassword = async (data) => {
        try {

            const response = await api.put(`customers/${id}/update`, { type: 'password', data: data.password });
            if (response) {
                updateUserInfo(response.data.data)
                setVisibilityPassModal(false)
                showToastWithGravity('Senha alterada com sucesso!')
            }
        } catch (error) {
            console.error(error)
        }

    }
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .label('Password')
            .required('O campo "senha" não pode ficar em branco')
            .min(6, 'A senha tem que ter pelo menos 6 caracteres '),
        passwordConfirmation: Yup.string()
            .label('passwordConfirmation')
            .required('A confirmação de senha é necessária')
            .min(6, 'A confirmação de senha tem que ter pelo menos 6 caracteres ')
            .test('passwords-match', 'As senhas devem ser iguais', function (value) {
                return this.parent.password === value;
            }),
    })
    return (
        <Modal
            transparent={true}
            animationType="slide"
            transparent={true}
            visible={visibilityPassModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <Formik
                            initialValues={{ password: '', passwordConfirmation: '' }}
                            onSubmit={values => { updatePassword(values) }}
                            validationSchema={validationSchema}
                        >
                            {({ handleChange,
                                values,
                                handleSubmit,
                                errors,
                                isValid,
                                touched,
                                handleBlur,
                            }) => (
                                    <View style={styles.contentContainer}>
                                        <View style={{ flex: 1, margin: 10, flexDirection: 'column' }}>
                                            <TextInput
                                                style={{ borderBottomColor: '#6200ee', borderBottomWidth: 1, padding: 10 }}
                                                value={values.password}
                                                onChangeText={handleChange('password')}
                                                placeholder="Nova senha"
                                                autoCapitalize="none"
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={showPass}
                                            />
                                            <ErrorMessage errorValue={touched.password && errors.password} />
                                        </View>
                                        <View style={{ flex: 1, margin: 10, flexDirection: 'column' }}>
                                            <TextInput
                                                style={{ borderBottomColor: '#6200ee', borderBottomWidth: 1, padding: 10 }}
                                                value={values.email}
                                                onChangeText={handleChange('passwordConfirmation')}
                                                placeholder="Confirmação de senha"
                                                autoCapitalize="none"
                                                onBlur={handleBlur('passwordConfirmation')}
                                                secureTextEntry={showPass}
                                            />
                                            <ErrorMessage errorValue={touched.passwordConfirmation && errors.passwordConfirmation} />
                                        </View>
                                        <View style={{ flex: 1, margin: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                                                <CheckBox
                                                    value={!showPass}
                                                    onValueChange={() => setShowPass(!showPass)}
                                                />
                                            </View>
                                            <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                                                <Text

                                                > Mostrar confirmação de senha</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={[styles.buttonStyle, {
                                                    backgroundColor: !isValid ? 'grey' : '#6200ee'
                                                }]}
                                                onPress={handleSubmit}
                                            >
                                                <Text style={{ color: 'white' }}>
                                                    Atualizar
                                            </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.buttonStyle}
                                                onPress={() => setVisibilityPassModal(!visibilityPassModal)}
                                            >
                                                <Text style={{ color: 'white' }}>
                                                    Voltar
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                        </Formik>
                    </View>
                </View>
            </View>
        </Modal >)
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        width: width / 1.2,
        height: height / 2,
        margin: 90,
        backgroundColor: 'white',
        borderRadius: 10
    },
    headerContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
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
export default connect(null, null)(ChangePassModal);