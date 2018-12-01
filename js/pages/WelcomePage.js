/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    FlatList,
    Alert,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import {_getLogout, _tokenCheck, _getLogistList} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'
import NavigatorUtils from '../utils/NavigatorUtils'

type Props = {};
export default class HomePage extends Component<Props> {
        constructor(props) {
            super(props)
        }
        componentDidMount() {
            // global.storage.clearMapForKey('user');

            this.checkToken()
            SplashScreen.hide()
        }
        /**
     * 判断token是否有效，否则跳转登录页面
     */
        async checkToken() {
            let user;
            try {
                user= await global.storage.load({
                    key:'user'
                })
            } catch(e) {
                NavigatorUtils.resetToLogin({navigation: this.props.navigation});
            }
            if (user.token) {
                var loginState = await HttpUtils.POST(_tokenCheck, 'token=' + user.token)
                if (loginState && loginState.state) {
                    NavigatorUtils.resetToLogin({navigation: this.props.navigation});
                } else {
                    NavigatorUtils.resetToHomepage({navigation: this.props.navigation});

                }
            } else {
                NavigatorUtils.resetToLogin({navigation: this.props.navigation});
            }
        }
        render() {
            return (<View style={styles.container}>
                {/* <TouchableOpacity onPress={ ()=>{this.checkToken()}}>
                    <Text>1111</Text>
                </TouchableOpacity> */}
            </View>);
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1
        }
    });
