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
    Alert
} from 'react-native';
import HttpUtils from '../../utils/HttpUtils'
import NavigatorUtils from '../../utils/NavigatorUtils'
import {_verifySMSEdit, _getPasswordBack, _getEditPassword} from '../../servers/getData'
import {Toast} from '../../utils/ToastUtils'
import Icon from 'react-native-vector-icons/Entypo'


export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            phone: '',
            yzm: '',
            password: '',
            checkPass: '',
            yzmMessage: '获取验证码'
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
    async verifyYzm() {
        if (this.state.phone == '') {
            if (phone == '') {
                Toast.show('请先填写手机号')
                return
            }
            return
        }
        let res = await HttpUtils.GET(_verifySMSEdit, {phone: this.state.phone})
        if (res) {
            this.timeCountdown(60)
        }
    }
    async getFirstStep(phone, yzm) {
        if (phone == '') {
            Toast.show('请先填写手机号')
            return
        }
        if (yzm == '') {
            Toast.show('请先填写验证码')
            return
        }
        const params = "phone=" + phone + "&smsVeriCode=" + yzm;
        let res = await HttpUtils.POST(_getPasswordBack, params);
        if (res) {
            this.setState({step: 2})
        }
    }
    firstRenderView() {
        return (<View style={styles.loginBox}>
            <Text style={styles.text}>手机号：</Text>
            <TextInput autoCapitalize='none' style={styles.textInput} onChangeText={(phone) => this.setState({phone})} value={this.state.phone}/>
            <Text style={styles.text}>验证码：</Text>
            <View style={styles.yzmBox}>
                <TextInput style={styles.textInput} onChangeText={(yzm) => this.setState({yzm})} value={this.state.yzm}/>
                <TouchableOpacity style={styles.yzmbutton} onPress={() => this.verifyYzm()}>
                    <Text style={styles.buttonText}>
                        {this.state.yzmMessage}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => this.getFirstStep(this.state.phone, this.state.yzm)}>
                <Text style={styles.buttonText}>
                    下一步
                </Text>
            </TouchableOpacity>
        </View>)
    }
    async getSecondStep(phone, password) {
        if (password == '') {
            Toast.show('请先填写密码')
            return
        }
        if (password !== this.state.checkPass) {
            Toast.show('2次密码不相同')
            return
        }
        const params = "phone=" + phone + "&password=" + password;

        let res = await HttpUtils.POST(_getEditPassword, params)
        if (res) {
            Alert.alert('提示', '密码修改成功！将跳往登录页面', [
                {
                    text: '确定',
                    onPress: () => {
                        NavigatorUtils.resetToLogin({navigation: this.props.navigation});
                    }
                }
            ],)
        }
    }
    secondRenderView() {
        return (<View style={styles.loginBox}>
            <Text style={styles.text}>手机号：</Text>
            <Text style={styles.textInput}>{this.state.phone}</Text>
            <Text style={styles.text}>密码：</Text>
            <TextInput secureTextEntry={true} style={styles.textInput} onChangeText={(password) => this.setState({password})} value={this.state.password} onEndEditing={(password) => {
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
            <TouchableOpacity style={styles.button} onPress={() => this.getSecondStep(this.state.phone, this.state.checkPass)}>
                <Text style={styles.buttonText}>
                    下一步
                </Text>
            </TouchableOpacity>
        </View>)
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const {navigation} = this.props;
        return (<View style={styles.container}>
            {
                this.state.step == 1
                    ? this.firstRenderView()
                    : this.secondRenderView()
            }
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
        </View>);
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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
