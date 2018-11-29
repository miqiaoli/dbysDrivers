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
import StorageUtil from '../utils/StorageUtil'
import {_getLogout, _tokenCheck, _getLogistList} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'
import NavigatorUtils from '../utils/NavigatorUtils'

type Props = {};
export default class HomePage extends Component<Props> {
        constructor(props) {
            super(props)
            this.state = {
                token: ''
            }
        }
        componentDidMount() {
            // StorageUtil.remove('token');

            this.checkToken()
            // SplashScreen.hide()
        }
        /**
     * 判断token是否有效，否则跳转登录页面
     */
        async checkToken() {
            // NavigatorUtils.resetToLogin({navigation: this.props.navigation});

            let token = await StorageUtil.get('token');
            if (token) {
                console.log('token:' + token);
                this.setState({token: token})
                this.props.navigation.setParams({
                    headerToken: token
                });
                var loginState = await HttpUtils.POST(_tokenCheck, 'token=' + token)
                if (loginState && loginState.state) {
                    NavigatorUtils.resetToLogin({navigation: this.props.navigation});
                } else {
                    // this.getLogistList()
                    NavigatorUtils.resetToHomepage({navigation: this.props.navigation, token: token});

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
