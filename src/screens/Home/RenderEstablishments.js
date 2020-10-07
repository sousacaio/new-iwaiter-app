import React from 'react';
import { View, Text, Dimensions, ImageBackground } from 'react-native';
import { API_URL } from '../../../env';
import { connect } from 'react-redux';

const { width } = Dimensions.get('window');
const RenderEstablishments = (props) => {
  return (
    <View
      style={{
        height: 160,
        width: width / 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a34edb',
        borderRadius: 10,
        margin: 5,
      }}>
      <ImageBackground
        resizeMode={'cover'}
        style={{
          flex: 1,
          height: 160,
          width: width / 1,
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
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Text style={{ color: 'white', fontSize: 25 }}>{props.name}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};
export default connect(null, null)(RenderEstablishments);
