/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text, Image
} from 'react-native';

const HistoryItem = ({ isClosed,
    isPaid, isCanceled, photo, soLongSince, total,
    name, city, street, number, index }) => {
    return (
        <View
            key={index}
            style={{
                flex: 1,
                backgroundColor: 'white',
                margin: 10,
                borderRadius: 10,
                alignItems: 'center',

            }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <Text>
                    {isClosed ? 'Fechada' : 'Não fechada'}
                </Text>
                {isPaid ? <Text>
                    Paga
                </Text> : <View></View>}
                {isCanceled ? <Text>
                    Cancelada
                    </Text> : <View></View>}

            </View>
            <View style={{
                flex: 4,
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                    <View style={{ flex: 1 }}>
                        <Image
                            resizeMode={'cover'}
                            style={{
                                flex: 1,
                                width: undefined,
                                height: undefined,
                                borderRadius: 5,
                            }}
                            source={{
                                uri: photo
                                    ? `http://192.168.15.5:3000/${photo}`
                                    : 'https://i.pinimg.com/originals/48/78/6d/48786db88c95237f6e0b375dc991448a.png',
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                    <Text>
                        {soLongSince}
                    </Text>
                    <Text>
                        R$ {total}
                    </Text>
                </View>
                <View style={{ flex: 1, margin: 10, padding: 10, justifyContent: 'space-evenly' }}>
                    <Text>
                        {name}
                    </Text>
                    <Text>
                        {city}
                    </Text>
                    <Text>
                        {street},{number}
                    </Text>
                </View>
            </View>
        </View>
    )
}
export default HistoryItem;