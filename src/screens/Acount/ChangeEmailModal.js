import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Dimensions, Modal,
    StyleSheet,
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
const ChangeEmailModal = ({ visibilityEmailModal, setVisibilityEmailModal }) => {

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
    const updateEmail = async (data) => {
        try {
            const response = await api.put(`customers/${id}/update`, { type: 'email', data: data.email });
            if (response) {
                updateUserInfo(response.data.data)
                setVisibilityEmailModal(false)
                showToastWithGravity('Email atualizado com sucesso!')
            }
        } catch (error) {
            console.error(error)
        }

    }
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .label('email')
            .email('Insira um e-mail válido!')
            .required('O campo "email" não pode ficar vazio!')
    })
    const useremail = useSelector(state => state.customer.email)
    return (
        <Modal
            transparent={true}
            animationType="slide"
            transparent={true}
            visible={visibilityEmailModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>

                    <View style={styles.headerContainer}>
                        <Formik
                            initialValues={{ email: '' }}
                            onSubmit={values => { updateEmail(values) }}
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
                                        <View style={styles.headerContainer}>
                                            <Text>Email atual: {useremail}</Text>
                                        </View>
                                        <View style={{ flex: 1, margin: 10, flexDirection: 'column' }}>
                                            <TextInput
                                                style={{ borderBottomColor: '#6200ee', borderBottomWidth: 1, padding: 10 }}
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
                                                onPress={() => setVisibilityEmailModal(!visibilityEmailModal)}
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
export default connect(null, null)(ChangeEmailModal);