/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import InitialStack from './src/navigators/MainStack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/services/authContext';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './src/reducers/index';

const store = createStore(rootReducer);

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <InitialStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </AuthProvider>
  );
};
export default App;
