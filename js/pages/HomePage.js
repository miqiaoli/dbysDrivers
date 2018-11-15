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
import Icon from 'react-native-vector-icons/AntDesign'

type Props = {};
export default class HomePage extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            title: "列表页", headerRight: (<TouchableOpacity style={{
                    paddingRight: 20
            }} onPress={() => {
                Alert.alert('提示', '确定退出该账户？', [
                    {
                            text: '取消',
                            style: 'cancel'
                    }, {
                            text: '确定',
                        onPress: () => {
                            console.log(this.state);
                            fetch(_getLogout, {
                                    method: "POST",
                                headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                },
                                    body: "token=" + params.headerToken
                            }).then(res => {
                                NavigatorUtils.resetToLogin({navigation: navigation});
                            });
                        }
                    }
                    ], {cancelable: false})
            }}>
                <Icon name="logout" size={22} color="#0078DD"/>
            </TouchableOpacity>)}
        }
        constructor(props) {
            super(props)
            this.state = {
                token: '',
                page_start: 1,
                page_limit: 15,
                list: [],
                isLoading: false
            }
        }
        componentDidMount() {
            this.checkToken()
            SplashScreen.hide()
        }
        getLogout() {}
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
                    this.getLogistList()
                }
            } else {
                NavigatorUtils.resetToLogin({navigation: this.props.navigation});
            }
        }
        async getLogistList() {
            console.log('getLogistList:' + this.state.token);
            let res = await HttpUtils.GET(_getLogistList, {
                token: this.state.token,
                page_start: this.state.page_start,
                page_limit: this.state.page_limit
            });
            if (res) {
                this.setState({list: res})
            }
        }
        renderButton(item) {
            let ButtonView,
                AbnormalButton,
                state = item.state, {navigation} = this.props;

            if (state == '0') {
                ButtonView = (<TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Delivery', {
                        token: this.state.token,
                        list_num: item.list_num,
                        product_name: item.product_name
                    })}>
                    <Text style={styles.button1Text}>
                        待发货
                    </Text>
                </TouchableOpacity>);
            } else if (state == '4') {
                ButtonView = (<TouchableOpacity style={styles.button1}>
                    <Text style={styles.button1Text}>
                        完成配送
                    </Text>
                </TouchableOpacity>);
            } else if (state == '-2') {
                ButtonView = (<TouchableOpacity style={styles.button1}>
                    <Text style={styles.button1Text}>
                        异常订单，已结束
                    </Text>
                </TouchableOpacity>);
            } else if (state == '1' || state == '2' || state == '3') {
                ButtonView = (<View style={styles.buttonBot}>
                    <TouchableOpacity style={styles.button1}>
                        <Text style={styles.button1Text}>
                            异常已上报
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Delivering', {
                            token: this.state.token,
                            list_num: item.list_num,
                            product_name: item.product_name
                        })}>
                        <Text style={styles.button1Text}>
                            配送中
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('ConfirmReceipt', {
                            token: this.state.token,
                            list_num: item.list_num,
                            product_name: item.product_name
                        })}>
                        <Text style={styles.button1Text}>
                            确认收货
                        </Text>
                    </TouchableOpacity>
                </View>);
            } else if (state == '-4') {
                AbnormalButton = (<TouchableOpacity style={styles.button1}>
                    <Text style={styles.button1Text}>
                        异常已上报
                    </Text>
                </TouchableOpacity>);
            }
            return (<View>
                {AbnormalButton}
                {ButtonView}
            </View>)
        }
        _renderItem(data) {
            const {item} = data
            return (<View style={styles.list}>
                <View style={styles.listContainer}>
                    <View style={styles.listTop}>
                        <Icon name="filetext1" size={22} color="#979797"/>
                        <Text style={styles.topTitle} onPress={() => {
                                navigation.navigate("ListDetails")
                            }}>{item.list_num}</Text>
                            <Icon name="right" size={20} color="#888888"/>
                    </View>
                    <View style={styles.listBox}>
                        <View style={styles.item}>
                            <Text style={styles.itemLabel}>商品名称</Text>
                            <Text style={styles.itemText}>{item.product_name}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemLabel}>数量</Text>
                            <Text style={styles.itemText}>{item.quantity}公斤</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemLabel}>收货地址</Text>
                            <Text style={styles.itemText}>{item.receiverAddress}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemLabel}>联系方式</Text>
                            <Text style={styles.itemText}>{item.receiverLinkman}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonBot}>
                        {this.renderButton(item)}
                    </View>
                </View>
            </View>)
        }
        render() {
            const {navigation} = this.props;

            return (<View style={styles.container}>
                <FlatList data={this.state.list}
                    renderItem={(data) => this._renderItem(data)}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl= {
                        <RefreshControl
                            title= {'Loading'}
                            colors={['red']}
                            tintColor={'orange'}
                            refreshing = {this.state.isLoading}
                            onRefresh = {() => {
                                this.loadData(true)
                            }}
                        />
                    }
                />
            </View>);
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F2F2F2'
        },
        list: {
            marginTop: 15,
            marginLeft: 12,
            marginRight: 12,
            marginBottom: 10,
            backgroundColor: '#fff',
            fontSize: 28
        },
        listContainer: {
            padding: 10
        },
        listTop: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        leftIcon: {
            width: 25,
            height: 25,
            marginRight: 10
        },
        topTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            marginLeft: 10
        },
        listBox: {
            paddingLeft: 26,
            paddingRight: 26,
            marginTop: 10
        },
        item: {
            flexDirection: 'row',
            marginBottom: 5
        },
        itemLabel: {
            width: 60,
            marginRight: 12,
            color: '#888888',
            textAlign: 'right'
        },
        buttonBot: {
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        button1: {
            borderColor: '#3B55E7',
            borderWidth: 1,
            color: '#3B55E7',
            borderRadius: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 6,
            paddingBottom: 6,
            marginLeft: 10
        },
        button1Text: {
            color: '#3B55E7'
        }
    });
