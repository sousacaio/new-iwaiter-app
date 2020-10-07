import React from 'react';
import {View, Text} from 'react-native';
const Tags = (props) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: props.bg,
          padding: 10,
          borderRadius: 5,
          alignContent: 'center',
        }}>
        <Text style={{alignSelf: 'center', color: 'white'}}>
          {props.children}
        </Text>
      </View>
    </View>
  );
};

export default Tags;
