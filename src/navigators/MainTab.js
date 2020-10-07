import React from 'react';
import CustomTabBar from '../components/CustomTabBar';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import DetailEstablishment from '../screens/DetailEstablishment/DetailEstablishment';
import Acount from '../screens/Acount/Acount';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Scan from '../screens/Scan';
import Catalog from '../screens/Catalog/Catalog';
import Cart from '../screens/Cart';
import History from '../screens/History/History';
import { useAuth } from '../services/authContext';
import { createDrawerNavigator } from '@react-navigation/drawer';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HistoryStack() {
  const { status } = useAuth();
  return (
    <Drawer.Navigator
    >
      <Drawer.Screen name="Home" component={Home} />
      {status === 'signOut' ? null : (
        <Drawer.Screen
          name="History"
          component={History}
          options={{ drawerLabel: 'Histórico' }}
        />
      )}
      <Drawer.Screen
        options={{ title: 'CPU Detail' }}
        name="DetailEstablishment" component={DetailEstablishment} />
    </Drawer.Navigator>
  );
}
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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HistoryStack} />
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
