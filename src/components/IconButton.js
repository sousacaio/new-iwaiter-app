import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Tags = (props) => {
  return (
    <TouchableOpacity
      style={{
        borderColor: props.borderColor,
        width: 200,
        height: 100,
        borderWidth: 2,
        borderRadius: 5,
      }}
      onPress={props.onPress}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={props.name} color={props.color} />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text>{props.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Tags;
