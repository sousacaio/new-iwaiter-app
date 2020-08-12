import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconHandler = ({ status }) => {

    return (<Icon name={status === 1 ? "check" : "hourglass"} size={30} color={status === 1 ? "green" : "black"} />)

}

export default IconHandler;