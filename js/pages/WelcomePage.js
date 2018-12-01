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
    ActivityIndicator,
    PermissionsAndroid,
    ToastAndroid
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
            if(Platform.OS === "android") {
              this.requestLocationPermission()
            }
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
                return
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
        async requestLocationPermission() {
          console.log('android1')

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        //第一次请求拒绝后提示用户你为什么要这个权限
                        'title': '我要地址查询权限',
                        'message': '没权限我不能工作，同意就好了'
                    }
                )

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    // this.show("你已获取了地址查询权限")
                    // ToastAndroid.show("你已获取了地址查询权限",ToastAndroid.SHORT)
                    ToastAndroid.show("获取地址查询失败",ToastAndroid.SHORT)
                }
                // else {
                //     // this.show("获取地址查询失败")
                //     ToastAndroid.show("获取地址查询失败",ToastAndroid.SHORT)
                // }
            } catch (err) {
                this.show(err.toString())
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
