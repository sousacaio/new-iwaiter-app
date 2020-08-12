/**
 * @format
 */
if (__DEV__) {
    import('./src/config/ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
//const OverlayApp = console.tron.overlay(App);
AppRegistry.registerComponent(appName, () => App);
