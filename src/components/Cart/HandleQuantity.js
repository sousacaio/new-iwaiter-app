import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('screen');
import { addQuantity, subtractQuantity } from '../../actions/cartActions';
import { useSelector, useDispatch } from 'react-redux'
import Reactotron from 'reactotron-react-native';
const HandleQuantityArea = (props) => {
    const [qt, setQt] = useState(props.quantity)
    const dispatch = useDispatch();
    useEffect(() => { }, [qt])
    return (
        <View style={styles.handleQuantityAreaContainer}>
            <View style={{ flex: 1, justifyContent: 'space-around', }}>
                {qt === 0 ?
                    <TouchableOpacity
                        style={styles.handleQuantityAreaButton}
                        onPress={() => {
                            dispatch(removeCartItem(props._id));
                        }}>
                        <Text style={{ fontSize: 30, color: '#6200ee' }}>
                            X
                    </Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        style={styles.handleQuantityAreaButton}
                        onPress={() => {
                            setQt(qt => qt - 1)
                            dispatch(subtractQuantity(props._id));
                        }}>
                        <Text style={{ fontSize: 30, color: '#6200ee' }}>
                            -
                     </Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.handleQuantityAreaView} >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#6200ee' }}>
                        {qt}
                    </Text>
                </View >
            </View >
            <View style={styles.handleQuantityAreaView}>
                <TouchableOpacity
                    style={styles.handleQuantityAreaButton}
                    onPress={() => {
                        setQt(qt => qt + 1)
                        dispatch(addQuantity(props._id));
                    }}>
                    <Text style={{ fontSize: 30, color: '#6200ee' }}>
                        +
                    </Text>
                </TouchableOpacity>
            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    handleQuantityAreaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    handleQuantityAreaView: {
        flex: 1,
        justifyContent: 'center'
    },
    handleQuantityAreaButton: {
        borderWidth: 1,
        borderColor: '#6200ee',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 50,
    }
});

export default connect(null, null)(HandleQuantityArea);