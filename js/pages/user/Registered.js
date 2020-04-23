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
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import HttpUtils from '../../utils/HttpUtils'
import NavigatorUtils from '../../utils/NavigatorUtils'
import {_verifyPhone, _verifySMS, _verifyCode, _getRegistered} from '../../servers/getData'
import CheckBox from 'react-native-check-box'
import {Toast} from '../../utils/ToastUtils'
import Icon from 'react-native-vector-icons/Entypo'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            checkPass: '',
            yzm: '',
            yzmMessage: '获取验证码',
            isChecked: true
        }
    }
    timeCountdown(time) {
        const _self = this
        let oTime = time
        if (oTime === 0) {
            this.setState({yzmMessage: '获取验证码'})
        } else {
            this.setState({
                yzmMessage: oTime + 's'
            })
            oTime--
            setTimeout(function() {
                _self.timeCountdown(oTime)
            }, 1000)
        }
    }
    async verifyYzm(e) {
        if (this.state.username == '') {
            Toast.show('请先填写手机号')
            return
        }

        let resVerifyPhone = await HttpUtils.GET(_verifyPhone, {phone: this.state.username})
        if (resVerifyPhone) {
            var res = await HttpUtils.GET(_verifySMS, {phone: this.state.username})
        }
        if (res) {
            this.timeCountdown(60)
        }
    }

    async getRegistered(phone, smsVeriCode, password, checkPass) {
        if (phone == '') {
            Toast.show('请先填写手机号')
            return
        }
        if (smsVeriCode == '') {
            Toast.show('请先填写验证码')
            return
        }
        if (password == '') {
            Toast.show('请先填写密码')
            return
        }
        if (this.state.password !== this.state.checkPass) {
            Alert.alert('提示', '2次密码不相同', [
                {
                    text: '确定',
                    onPress: () => {}
                }
            ])
            return
        }
        const params = "phone=" + phone + "&smsVeriCode=" + smsVeriCode + "&password=" + password + "&checkPass=" + checkPass;

        let res = await HttpUtils.POST(_getRegistered, params);
        if (res) {
            Alert.alert('提示', '注册成功！将跳往登录页面', [
                {
                    text: '确定',
                    onPress: () => {
                        NavigatorUtils.resetToLogin({navigation: this.props.navigation});
                    }
                }
            ],)
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const {navigation} = this.props;
        return (<ScrollView style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.text}>手机号：</Text>
                <TextInput autoCapitalize='none' style={styles.textInput} onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                <Text style={styles.text}>验证码：</Text>
                <View style={styles.yzmBox}>
                    <TextInput style={styles.textInput} onChangeText={(yzm) => this.setState({yzm})} value={this.state.yzm}/>
                    <TouchableOpacity style={styles.yzmbutton} onPress={() => this.verifyYzm()}>
                        <Text style={styles.buttonText}>
                            {this.state.yzmMessage}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>密码：</Text>
                <TextInput secureTextEntry={true} style={styles.textInput} onChangeText={(password) => this.setState({password})} value={this.state.password} onBlur={(password) => {
                    if (password.length < 6) {
                        Alert.alert('提示', '密码不少于6位数', [
                            {
                                    text: '确定',
                                onPress: () => {}
                            }
                        ],)
                    }
                }}/>
                <Text style={styles.text}>确认密码：</Text>
                <TextInput secureTextEntry={true} style={styles.textInput} onChangeText={(checkPass) => this.setState({checkPass})} value={this.state.checkPass}/>
                <View style={styles.info}>
                    <CheckBox style={{
                            flex: 1
                    }} onClick={() => {
                        this.setState({
                                isChecked: !this.state.isChecked
                        })
                    }} isChecked={this.state.isChecked} rightText={"我已阅读并同意"} checkedCheckBoxColor='#0078DD' uncheckedCheckBoxColor='#cbcbcb'/>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('RegisteredAgreement')
                    }}>
                        <Text style={styles.fontBlue}>
                            《商城用户注册协议》
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isChecked
                        ? (<TouchableOpacity style={styles.button} onPress={() => this.getRegistered(this.state.username, this.state.yzm, this.state.password, this.state.checkPass)}>
                            <Text style={styles.buttonText}>
                                注册
                            </Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity style={[
                            styles.button, {
                                    backgroundColor: '#80bcee'
                            }
                        ]}>
                            <Text style={styles.buttonText}>
                                注册
                            </Text>
                        </TouchableOpacity>)
                }
            </View>
            <View style={styles.loginText}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Login')
                }}>
                    <Text>
                        已有账号，马上登陆
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.loginFoot}>
                <Icon name="old-phone" size={20} style={{marginRight: 20}} color="#0078DD"/>
                <Text>客服热线：0755-83227395</Text>
            </View>
        </ScrollView>);
    }
}

const styles = StyleSheet.create({
    checkImage: {
        width: 16,
        height: 16
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
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
        marginTop: 20,
        alignItems: 'center'
    },
    yzmBox: {
        position: 'relative'
    },
    yzmbutton: {
        width: 120,
        height: 35,
        position: 'absolute',
        top: 8,
        right: 15,
        paddingTop: 8,
        backgroundColor: '#0078DD',
        borderRadius: 5,
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
        flexDirection: 'row'
    },
    loginFoot: {
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // bottom: 40,
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    phone: {
        width: 18,
        height: 14,
        marginRight: 20
    },
    info: {
        width: 300,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    fontBlue: {
        color: '#0078DD'
    }
});
