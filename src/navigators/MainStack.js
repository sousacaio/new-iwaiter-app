import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from '../services/authContext';
import Home from '../screens/Home/Home';
import Acount from '../screens/Acount/Acount';
import Login from '../screens/Login';
import Scan from '../screens/Scan';
import Catalog from '../screens/Catalog';
import Cart from '../screens/Cart';

const Stack = createStackNavigator();
const homeStackNav = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();

function OrderStack() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="Catalog" component={Catalog} />
            <TopTab.Screen name="Cart" component={Cart} />
        </TopTab.Navigator>
    );
}

function ScanStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Scan" component={Scan} />
            <Stack.Screen name="Order" component={OrderStack} />
        </Stack.Navigator>
    );
}




export default function InitialStack() {
    const { status } = useAuth();
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#6200ee',
                inactiveTintColor: 'grey',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
            />
            {status === 'signOut' ? null : (
                <Tab.Screen name="Comanda" component={ScanStack} />
            )}
        
            {status === 'signOut' ? (
                <Tab.Screen
                    name="Login"
                    component={Login}
                />
            ) : (
                    <Tab.Screen name="Conta" component={Acount} />
                )}
        </Tab.Navigator>
    )
}


