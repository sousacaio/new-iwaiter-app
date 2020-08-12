import React, { useEffect, useState } from 'react';
import { Text, View, Image, Dimensions, Modal, StyleSheet, Button, TouchableOpacity, ToastAndroid } from 'react-native';
import Tags from '../Tags';
const { width, height } = Dimensions.get('window')

const ProductModal = ({ modalVisible, setModalVisible, dataToPutOnModal, handleClick, total }) => {
    const handleClickAdd = (_id) => {
        handleClick(_id);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View style={styles.modalContainer}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.backButtonContainer}
                        onPress={() => { setModalVisible(!modalVisible) }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => { setModalVisible(!modalVisible) }}>
                            <Text style={{ fontSize: 50, color: '#6200ee' }} >{'<'} </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ModalimageBackground}>
                        <View style={styles.imageContainer}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.image}
                                source={{ uri: `http://192.168.15.5:3000/${dataToPutOnModal.photo}` }} />
                        </View>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.nameContainer}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.nameText}
                            >{dataToPutOnModal.name}
                            </Text>
                        </View>
                        <View style={styles.valueContainer} >
                            <Tags bg="#6200ee">
                                R$ {dataToPutOnModal.value}
                            </Tags>
                        </View>
                    </View>
                    <View style={{ flex: 4, }}>
                        <View style={{ flex: 3, marginTop: 10 }}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={{ fontSize: 20, color: '#A6A6A6' }}
                            >{dataToPutOnModal.description}  </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>

                                <TouchableOpacity
                                    style={styles.buttonStyle}
                                    onPress={() => {
                                        ToastAndroid.showWithGravityAndOffset(
                                            `${dataToPutOnModal.name} foi adicionado a seu carrinho`,
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            25,
                                            50
                                        );
                                        handleClickAdd(dataToPutOnModal._id)
                                        setModalVisible(!modalVisible)
                                    }}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={{
                                            fontSize: 30,
                                            color: 'white'
                                        }}>{'>> Adicionar ao carrinho'} </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>)
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    ModalimageBackground: {
        zIndex: 0,
        elevation: 0,
        flex: 5,
        alignSelf: 'flex-end'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    imageContainer: {
        flex: 1,
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
        borderTopLeftRadius: 5
    },
    contentContainer: {
        flex: 1,
        margin: 10
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    nameContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    },
    nameText: {
        fontWeight: 'bold',
        fontSize: 30,
        fontStyle: 'italic',
        alignSelf: 'flex-start'
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
        padding: 2
    }
});

export default ProductModal;