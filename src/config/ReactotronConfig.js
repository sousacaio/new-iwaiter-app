import Reactotron, { overlay, trackGlobalErrors } from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron
    .setAsyncStorageHandler(AsyncStorage)
    .configure()
    .useReactNative()
    .use(overlay())
    .use(trackGlobalErrors())
    .use(reactotronRedux())
    .connect()

export default reactotron;