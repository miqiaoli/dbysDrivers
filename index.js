/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import JPushModule from 'jpush-react-native'
JPushModule.initPush();
AppRegistry.registerComponent(appName, () => App);
