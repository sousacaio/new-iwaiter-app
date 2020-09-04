/* eslint-disable */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Preload from '../screens/Preload/Preload';
import MainTab from './MainTab';
const Stack = createStackNavigator();

export default function InitialStack() {
  return (
    <Stack.Navigator
      initialRouteName="Preload"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Preload" component={Preload} />
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
  );
}
