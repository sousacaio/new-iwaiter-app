/* eslint-disable */
import React from 'react';
import CustomTabBar from '../components/CustomTabBar';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Acount from '../screens/Acount/Acount';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Scan from '../screens/Scan';
import Catalog from '../screens/Catalog';
import Cart from '../screens/Cart';
import { useAuth } from '../services/authContext'
    ;
const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function OrderStack() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="Catalog" component={Catalog} />
            <TopTab.Screen name="Cart" component={Cart} />
        </TopTab.Navigator>
    );
}

function LoginStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
                component={Login}
            />
            <Stack.Screen
                options={{ title: 'Registre-se!', headerShown: true }}
                name="SignUp"
                component={SignUp}
            />
        </Stack.Navigator>
    );
}
function ScanStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Scan" component={Scan} />
            <Stack.Screen name="Order" component={OrderStack} />
        </Stack.Navigator>
    );
}


export default function MainTab() {
    const { status } = useAuth();
    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={Home} />
            {status === 'signOut' ? null : (
                <Tab.Screen name="Comanda" component={ScanStack} />
            )}
            {status === 'signOut' ? (
                <Tab.Screen name="Login" component={LoginStack} />
            ) : (
                    <Tab.Screen name="Conta" component={Acount} />
                )}
        </Tab.Navigator>
    );
}
