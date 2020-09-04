/* eslint-disable */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderEstablishments from './RenderEstablishments';
import RenderPromos from './RenderPromos';
import RenderCategories from './RenderCategories';
import RenderRecomended from './RenderRecomended';
import { useNavigation } from '@react-navigation/native';
const Home = (props) => {
    const navigation = useNavigation()
    const DATA = [
        {
            id: '12bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '233ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '33358694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
        {
            id: '333358694a0f-3da1-471f-bd96-145571e329d72',
            title: 'Third Item',
        },
        {
            id: '5658694a0f-3da1-471f-bd96-1425571e29d72',
            title: 'Third Item',
        },
        {
            id: '8958694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ];
    const categories = [
        {
            id: '1',
            name: 'Bebidas',
            icon: 'menu',
        },
        {
            id: '2',
            name: 'Comidas',
            icon: 'menu',
        },
        {
            id: '3',
            name: 'Sobremesas',
            icon: 'menu',
        },
    ];
    React.useEffect(() => {
        if (props.route.params)
            navigation.navigate('Comanda', {
                screen: 'Scan',
                params: {
                    id_point: props.route.params.id_point,
                    id_establishment: props.route.params.id_establishment,
                }
            });
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30 }}>Restaurantes parceiros:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => {
                            return <RenderEstablishments title={item.title} />;
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30 }}>Promoções:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => {
                            return <RenderPromos title={item.title} />;
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30 }}>Categorias:</Text>
                    <FlatList
                        horizontal={true}
                        data={categories}
                        renderItem={({ item }) => {
                            return <RenderCategories iconName={item.icon} name={item.name} />;
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={{ flex: 1, margin: 10 }}>
                    <Text style={{ fontSize: 30 }}>Recomendados:</Text>
                    <FlatList
                        horizontal={true}
                        data={DATA}
                        renderItem={(item) => {
                            return <RenderRecomended />;
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default Home;
