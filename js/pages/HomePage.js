/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
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
import {_getLogout, _tokenCheck, _getTodoList, _saveLocation} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'
import NavigatorUtils from '../utils/NavigatorUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import { Geolocation } from "react-native-amap-geolocation"
import BackgroundTimer from 'react-native-background-timer'

type Props = {};
export default class HomePage extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            title: "未完成订单",
            headerRight: (<TouchableOpacity style={{
                    paddingRight: 20
            }} onPress={() => {
                navigation.navigate('HistoryListPage', {
                    token: params.headerToken
                })
            }}>
                <Icon name="md-settings" size={25} color="#0078DD"/>
            </TouchableOpacity>)
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            page_start: 1,
            page_limit: 5,
            list: [],
            counts: null,//总条数
            isLoading: false,
            location: {},
            locations: [],
            points: []
        }
    }

    async componentDidMount() {
        let user= await global.storage.load({
            key:'user'
        })
        console.log(user);

        this.props.navigation.setParams({ headerToken:user.token })
        this.setState({
            token: user.token
        }, ()=> {
            this.getLogistList()
        })
        // 初始化定位功能
        await Geolocation.init({
          ios: "a421265fe274bd3e2863ac0fcefde36b",
          android: "68b927bf24f7185ac2a06049c69c3148"
        });
        Geolocation.setOptions({
          interval: 10000,
          distanceFilter: 10,
          background: true,
          reGeocode: true
        });

        Geolocation.addLocationListener(location => {
          console.log(222);
          this.updateLocationState(location)
        });

        Geolocation.start();

        // 开启后台定时器
        BackgroundTimer.runBackgroundTimer(() => {
            console.log('定时器');
            if(this.state.locations.length > 1) {
                console.log('sendData');
                this.SaveLocations()
            }
        },
        3000);
    }
    async SaveLocations() {
        const params = "token=" + this.state.token + "&locations=" + JSON.stringify(this.state.locations);
        var loginState = await HttpUtils.POST(_saveLocation, params, true)
        console.log(loginState);
        if(loginState) {
            this.setState({
                locations: []
            })
        }
    }
    updateLocationState(location) {
        if (location) {
            location.timestamp = Date.now();
            if(location.timestamp!==this.state.timestamp) {
                this.setState({ location, locations: [...this.state.locations,location], points: [...this.state.points,location]});
                console.log(location);
            }
        }
    }
    async getLogistList() {
        let res = await HttpUtils.GET(_getTodoList, {
            token: this.state.token
        });
        if (res) {
            // this.setState({list: []})
            this.setState({list: res.data[0] || ''})
        }
    }
    renderButton(state, list_num) {
        let ButtonView,
            {navigation} = this.props;

        if (state == '0') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Delivery', {
                    token: this.state.token,
                    list_num: list_num
                })}>
                    <Text style={styles.buttonText}>
                        待发货
                    </Text>
                </TouchableOpacity>
            </View>);
        } else if (state == '1' || state == '2' || state == '3') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Delivering', {
                        token: this.state.token,
                        list_num: list_num
                })}>
                    <Text style={styles.buttonText}>
                        途中异常
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('ConfirmReceipt', {
                        token: this.state.token,
                        list_num: list_num
                })}>
                    <Text style={styles.buttonText}>
                        确认收货
                    </Text>
                </TouchableOpacity>
            </View>);
        } else if (state == '4') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.buttonText}>
                        完成配送
                    </Text>
                </TouchableOpacity>
            </View>);
        }
        return (ButtonView)
    }
    getAbnormal(state){
        if(state == '2' || state == '3') {
            return (<TouchableOpacity style={[styles.item, {justifyContent: 'flex-end'}]} onPress={() => this.props.navigation.navigate('ListDetails', {
                token: this.state.token,
                list_num: this.state.list.list_num
            })}>
                <Text style={styles.itemError}>异常信息</Text>
            </TouchableOpacity>)
        }
    }
    _renderItem(){
        let renderItem
        const item = this.state.list
        if(this.state.list) {
            renderItem = (<View style={styles.list}>
                <View style={styles.listContainer}>
                    <View style={styles.listTop}>
                        <Icon name="ios-document" size={22} color="#979797"/>
                        <Text style={styles.topTitle}>{item.list_num}</Text>
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
                        {this.getAbnormal(item.state)}

                    </View>
                </View>
            </View>)
        } else {
            renderItem = (<View style={styles.none}>
                <Text style={styles.noneText}>~~暂无未完成订单~~</Text>
            </View>)
        }
        return renderItem
    }
    render() {
        const {navigation} = this.props;
        const item = this.state.list

        return (<View style={styles.container}>
            {/* <TouchableOpacity onPress={ () => {
                navigation.navigate("LocationPage")
                }}>
                <Text>定位</Text>
                </TouchableOpacity>
                <FlatList
                data={this.state.points}
                renderItem={({item}) => <View>
                    <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                <Text>latitude: </Text>
                <Text>{item.latitude}</Text>
                <Text>timestamp: </Text>
                <Text>{item.timestamp}</Text>
                <Text>longitude: </Text>
                <Text>{item.longitude}</Text>
                    </View>
                </View>}
            /> */}
            {/* <TouchableOpacity onPress={ () => {
                this.getLogistList()
                }}>
                <Text>获取列表</Text>
            </TouchableOpacity> */}
            {this._renderItem()}

            {this.renderButton(item.state, item.list_num)}
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
        fontSize: 28,
        borderRadius: 8
    },
    listContainer: {
        padding: 10
    },
    listTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    leftIcon: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    topTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10
    },
    listBox: {
        // paddingLeft: 26,
        // paddingRight: 26,
        marginTop: 20
    },
    item: {
        flexDirection: 'row',
        marginBottom: 10
    },
    itemLabel: {
        width: 92,
        marginRight: 12,
        color: '#888888',
        textAlign: 'right',
        fontSize: 22,
        lineHeight: 30
    },
    itemText: {
        fontSize: 22,
        flex: 1,
        lineHeight: 30
    },
    itemError:{
        color: 'red',
        fontSize: 22,
        lineHeight: 30
    },
    buttonBot: {
        flexDirection: 'row'
    },
    button1: {
        flex: 1,
        backgroundColor: '#0078DD',
        borderColor: '#0078DD',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button2: {
        flex: 1,
        backgroundColor: '#EB4E35',
        borderColor: '#EB4E35',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        marginBottom:20
    },
    none: {
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noneText: {
        fontSize:24
    }
});
