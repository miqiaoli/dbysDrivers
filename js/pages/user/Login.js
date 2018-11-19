/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StackActions, NavigationActions} from 'react-navigation';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import StorageUtil from '../../utils/StorageUtil'
import HttpUtils from '../../utils/HttpUtils'
import NavigatorUtils from '../../utils/NavigatorUtils'
import {_getLogin} from '../../servers/getData'
import {Toast} from '../../utils/ToastUtils'
import Icon from 'react-native-vector-icons/Entypo'

type Props = {};
export default class Login extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    async getLogin(username, password) {
        if (username == '') {
            Toast.show('请先填写用户名')
            return
        }
        if (password == '') {
            Toast.show('请先填写密码')
            return
        }

        const params = "username=" + username + "&password=" + password;

        let res = await HttpUtils.POST(_getLogin, params);
        if (res) {
            StorageUtil.set('token', res.token);
            StorageUtil.set('username', username);
            Toast.show('登录成功')
            NavigatorUtils.resetToHomepage({navigation: this.props.navigation, token: res.token});
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const {navigation} = this.props
        return (<View style={styles.container}>
            <Image style={styles.loginBg} source={require('../../../res/images/login-bg.png')}/>
            <View style={styles.loginBox}>
                <Text style={styles.text}>用户名：</Text>
                <TextInput autoCapitalize='none' style={styles.textInput} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                <Text style={styles.text}>密码：</Text>
                <TextInput secureTextEntry={true} style={styles.textInput} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
                <TouchableOpacity style={styles.button} onPress={() => this.getLogin(this.state.username, this.state.password)}>
                    <Text style={styles.buttonText}>
                        登录
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.loginText}>
                <TouchableOpacity onPress={() => {
                        navigation.navigate('Registered')
                    }}>
                    <Text>
                        注册新用户
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                        navigation.navigate('ForgetPassword')
                    }}>
                    <Text>
                        忘记密码
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.loginFoot}>
                <Icon name="old-phone" size={20} style={{marginRight: 20}} color="#0078DD"/>
                <Text>客服热线：400-888-9383</Text>
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    loginBg: {
        width: '100%',
        height: 200,
        resizeMode: 'cover'
    },
    loginBox: {
        paddingRight: 12,
        paddingLeft: 12,
        paddingBottom: 10
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 20
    },
    textInput: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 4,
        fontSize: 18
    },
    button: {
        backgroundColor: '#0078DD',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 5,
        marginTop: 40,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#fff'
    },
    loginText: {
        paddingTop: 15,
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loginFoot: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    phone: {
        width: 18,
        height: 14,
        marginRight: 20
    }
});
