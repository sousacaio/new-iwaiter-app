import React from 'react';

const ViewComponent = (props) => {
    const { flex, flexDirection, margin, padding, backgroundColor } = props;
    if (!flex) {
        flex = 1;
    }
    if (!flexDirection) {
        flexDirection = 'row';
    }
    if (!margin) {
        margin = 0;
    }
    if (!padding) {
        padding = 0
    }
    if (!backgroundColor) {
        backgroundColor = "white";
    }
    return (
        <View
            style={{
                flex,
                flexDirection,
                margin,
                padding,
                backgroundColor
            }}
        >
            {props.children}
        </View>
    )
}

export default ViewComponent;