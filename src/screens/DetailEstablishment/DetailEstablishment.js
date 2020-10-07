import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ImageBackground,
    Dimensions,
    ActivityIndicator,
    Image
} from 'react-native';
import Tags from '../../components/Tags'
import { API_URL } from '../../../env';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import ProductModal from '../../components/Catalog/ProductModal';
const DetailEstablishment = (props) => {

    const [dataToPutOnModal, setDataToPutOnModal] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const catchDataToPutOnModal = (data) => {
        setDataToPutOnModal(data);
    };
    function renderItem({ item, index }) {
        const { value } = item;
        const newValue = parseFloat(value).toFixed(2);

        const photoUri = API_URL + item.photo;

        return (
            <>

                <TouchableOpacity
                    key={index}
                    style={{ margin: 1 }}
                    onPress={() => {
                        setModalVisible(true);
                        catchDataToPutOnModal(item);
                    }}
                >
                    <View style={styles.cardContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.imageStyle}
                                source={{
                                    uri: item.photo
                                        ? photoUri
                                        : 'https://img.elo7.com.br/product/zoom/22565B3/adesivo-parede-prato-comida-frango-salada-restaurante-lindo-adesivo-parede.jpg',
                                }}
                            />
                        </View>
                        <View style={styles.dataContainer}>
                            <View style={{ flex: 2 }}>
                                <ViewWithText
                                    flex={1}
                                    margin={10}
                                    color="grey"
                                    text={item.category}
                                />
                                <ViewWithText
                                    flex={2}
                                    margin={10}
                                    fontSize={20}
                                    fontStyle="italic"
                                    text={item.name}
                                />
                                <ViewWithText
                                    flex={1}
                                    margin={10}
                                    color="grey"
                                    text={item.description}
                                />
                            </View>
                            <View style={styles.tagContainer}>
                                <Tags bg="#F49A2C">0.0</Tags>
                                <Tags bg="#6200ee">{newValue}</Tags>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }

    const navigation = useNavigation();
    const {
        route: {
            params: {
                item: {
                    email,
                    name,
                    phone,
                    catalog,
                    points,
                    settings: { workingDays, openingHours, closingTime },
                },
            },
        },
    } = props;

    console.log(JSON.stringify(props.route, null, '\t'));
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width, height: height / 15 }}>
                <TouchableOpacity style={{ width, height: height / 14, backgroundColor: '#6200ee', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
                    <Text style={{ color: 'white', fontSize: 20 }}> {`<< `}Voltar </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 5 }}>
                {/*View da imagem e nome do restaurante */}
                <View
                    style={{
                        height: 300,
                        width: width,
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#a34edb',
                    }}>
                    <ImageBackground
                        resizeMode={'cover'}
                        style={{
                            height: 300,
                            width: width,
                            borderRadius: 10,
                        }}
                        imageStyle={{ opacity: 0.5 }}
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1518685101044-3b5a4e7580a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                        }}>
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: 10,
                                margin: 5,
                            }}>
                            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 25 }}> {name}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 15 }}> Mesas:</Text>
                                    <Text style={{ color: 'white', fontSize: 25 }}> {points.length}</Text>
                                </View>
                                <View
                                    style={{
                                        width: 3,
                                        alignContent: 'center', justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: 'white'
                                    }}
                                />
                                <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 15 }}> Telefone(s):</Text>
                                    <Text style={{ color: 'white', fontSize: 15 }}> {phone}</Text>
                                </View>
                                <View
                                    style={{
                                        width: 3,
                                        alignContent: 'center', justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: 'white'
                                    }}
                                />
                                <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 15 }}> Endereço:</Text>
                                    <Text style={{ color: 'white', fontSize: 15 }}> {phone}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: '#6200ee', margin: 5, padding: 10, borderRadius: 10 }} >
                        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontSize: 25, color: 'white' }}>Funcionamento:</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Text style={{ color: 'white' }}>De </Text>
                            <Text style={{ color: 'white' }}> {workingDays[0]} </Text>
                            <Text style={{ color: 'white' }}> a </Text>
                            <Text style={{ color: 'white' }}> {workingDays[workingDays.length - 1]} </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Text style={{ color: 'white' }}> Das </Text>
                            <Text style={{ color: 'white' }}> {openingHours} </Text>
                            <Text style={{ color: 'white' }}> as </Text>
                            <Text style={{ color: 'white' }}> {closingTime} </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>

                    <FlatList
                        data={catalog}
                        renderItem={({ item, index }) => renderItem({ item, index })}
                        keyExtractor={(item, index) => `list-item-${index}`}
                        ListEmptyComponent={
                            <View style={styles.container}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        }
                    />
                </View>
                <ProductModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    dataToPutOnModal={dataToPutOnModal}
                 
                />
            </ScrollView>
        </SafeAreaView>
    );
};
const ViewWithText = ({ flex, margin, color, fontSize, fontStyle, text }) => {
    return (
        <View style={{ flex: flex, margin: margin }}>
            <Text
                numberOfLines={3}
                ellipsizeMode={'tail'}
                style={{
                    color: color ? color : 'black',
                    fontSize: fontSize ? fontSize : 15,
                    fontStyle: fontStyle ? fontStyle : 'normal',
                }}>
                {text}
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    cardContainer: {
        height: height / 4,
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 1,
        margin: 10,
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        borderRadius: 5,
    },
    dataContainer: {
        flex: 2,
        flexDirection: 'row',
    },
    categoryContainer: {
        flex: 1,
        margin: 10,
    },
    tagContainer: {
        margin: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    textStyle: {
        flex: 2,
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
    },
    touchableHigh: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        borderRadius: 10,
        margin: 10,
    },
});
export default DetailEstablishment;
