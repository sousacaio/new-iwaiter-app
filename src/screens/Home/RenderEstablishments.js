
import React from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';

import { connect } from 'react-redux';

const { width } = Dimensions.get('window')
const RenderEstablishments = (props) => {
    return (
        <View style={{
            height: 160, width: width / 1.2,
            alignContent: 'center', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#a34edb',
            borderRadius: 10,
            margin: 5
        }}>
            <Text >{props.title}</Text>
            <Text>Imagem do restaurante</Text>
        </View>
    );
}
export default connect(null, null)(RenderEstablishments)