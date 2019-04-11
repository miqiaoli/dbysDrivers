
import {AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';
import {AppStackNavigator} from './js/Navigators/AppNavigator'

// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})
// 全局变量
global.storage = storage
export default AppStackNavigator
