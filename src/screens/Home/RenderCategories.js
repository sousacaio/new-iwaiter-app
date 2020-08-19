
import React from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window')
const RenderCategories = (props) => {
    
    return (
        <View style={{
            height: 100, width: width / 3.7,
            alignContent: 'center', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10,
            borderColor: '#6200ee',
            borderWidth: 3,
            borderRadius: 15,
            margin: 5
        }}>
            <View style={{ flex: 1 }}>
                <Entypo name={props.iconName} style={{ flex: 1 }} size={70} color="#6200ee" />
            </View>
            <Text>{props.name}</Text>
        </View>
    );
}
export default RenderCategories;