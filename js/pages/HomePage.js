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
    ScrollView,
    Alert,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Linking,
    Platform
    // DeviceEventEmitter,
    // ToastAndroid,
} from 'react-native';
import {_getLogout, _tokenCheck, _getTodoList, _saveLocation, _mapIDIos, _mapIDAndroid} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'
import NavigatorUtils from '../utils/NavigatorUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import BasicUtils from '../utils/BasicUtils'
// import LocationUtil from '../utils/LocationUtil'

import { Geolocation } from "react-native-amap-geolocation"
import BackgroundTimer from 'react-native-background-timer'

type Props = {};
// let Geolocation;
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
            refreshing: false,
            location: {},
            locations: [],
            point: {},
            listNumArr: []
        }
    }

    async componentDidMount() {
        let user= await global.storage.load({
            key:'user'
        })
        // Geolocation = await global.storage.load({
        //     key:'geolocation'
        // })
        // Geolocation = this.props.navigation.state.params.geolocation

        // 初始化定位功能
        await Geolocation.init({
          ios: _mapIDIos,
          android: _mapIDAndroid
        });
        await Geolocation.setOptions({
          interval: 600000,  //600000
          distanceFilter: 1000,  //1000
          background: true,
          reGeocode: true
        });

        this.props.navigation.setParams({ headerToken:user.token })

        this.setState({
            token: user.token
        }, ()=> {
            this.getLogistList()
        })

        Geolocation.addLocationListener(location => {
          this.updateLocationState(location)
        });
        // let location = LocationUtil.locationListener()
        // LocationUtil.geolocation.addLocationListener(location => {
        //   this.updateLocationState(location)
        // })

        // console.log(location);
    }
    startGeolocation(){
        Geolocation.start()
        // 开启后台定时器
        BackgroundTimer.runBackgroundTimer(() => {
            console.log('定时器');
            if(this.state.locations.length > 0) {
                this.SaveLocations()
                console.log('上传定位');
            }
        }, 3000);
    }
    async SaveLocations() {
        const params = "token=" + this.state.token + "&list_num=" + JSON.stringify(this.state.listNumArr) + "&locations=" + JSON.stringify(this.state.locations) ;
        var loginState = await HttpUtils.POST(_saveLocation, params, true)
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
                this.setState({ location, locations: [...this.state.locations,location] });
            }
            console.log(location)
        }
    }
    async getLogistList() {
        let res = await HttpUtils.GET(_getTodoList, {
            token: this.state.token
        });
        if (res) {
            let listNumArr = [],
            data = BasicUtils.jsonSort(res.data, 'list_num', true)


            for( let i = 0; i<data.length; i++ ) {
                if(data[i].state == '1' || data[i].state == '2' || data[i].state == '3'){
                    listNumArr.push(data[i].list_num)
                }
            }

            if(listNumArr.length>0) {
                this.startGeolocation()
            } else {
                Geolocation.stop()
                BackgroundTimer.stopBackgroundTimer()
            }
            this.setState({list: data, listNumArr: listNumArr})
        }
    }

    async btnNext(str, list_num){
        let {navigation} = this.props;
        Geolocation.stop();
        navigation.navigate(str, {
                token: this.state.token,
                list_num: list_num,
                // point: this.state.point,
                geolocation: Geolocation
        })
    }
    renderButton(state, list_num) {
        let ButtonView,
            {navigation} = this.props;

        if (state == '0') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button1} onPress={() => {
                    this.btnNext('Delivery', list_num)
                }}>
                    <Text style={styles.button1Text}>
                        待发货
                    </Text>
                </TouchableOpacity>
            </View>);
        } else if (state == '1' || state == '2' || state == '3') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button2} onPress={() => {
                    this.btnNext('Delivering', list_num)
                }}>
                    <Text style={styles.button2Text}>
                        途中异常
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button1} onPress={() => {
                    this.btnNext('ConfirmReceipt', list_num)
                }}>
                    <Text style={styles.button1Text}>
                        货物送达
                    </Text>
                </TouchableOpacity>
            </View>);
        } else if (state == '4') {
            ButtonView = (<View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.button1Text}>
                        完成配送
                    </Text>
                </TouchableOpacity>
            </View>);
        }
        return (ButtonView)
    }
    getAbnormal(state, list_num){
        if(state == '2' || state == '3') {
            return (<TouchableOpacity style={[styles.item, {justifyContent: 'flex-end'}]} onPress={() => this.props.navigation.navigate('ListDetails', {
                token: this.state.token,
                list_num: list_num
            })}>
                <Text style={styles.itemError}>异常信息</Text>
            </TouchableOpacity>)
        }
    }
    _renderItem(data) {
        const {item} = data
        renderItem = (<View style={styles.list}>
            <View style={styles.listContainer}>
                <View style={styles.listTop}>
                    {/* <Icon name="ios-document" size={22} color="#979797"/> */}
                    <Image
                        style={styles.fileImage}
                        source={require('../../res/images/icon-file.png')}
                    />
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
                    {this._renderAddressItem(item)}

                    {
                        item.picker ? (<View style={styles.item}>
                            <Text style={styles.itemLabel}>联系人</Text>
                            <Text style={styles.itemText}>{item.picker}</Text>
                        </View>) : null
                    }
                    {
                        item.pickerPhone ? (<View style={styles.item}>
                            <Text style={styles.itemLabel}>联系电话</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Linking.openURL('tel:'+item.pickerPhone).catch(e=>console.log(e))
                                }}>
                                <Text style={styles.itemText}>{item.pickerPhone}</Text>
                            </TouchableOpacity>
                        </View>) : null
                    }
                    {this.getAbnormal(item.state, item.list_num)}
                </View>
            </View>
            {this.renderButton(item.state, item.list_num)}
        </View>)
        return renderItem
    }
    _renderAddressItem(item) {
      let addressItem;
      if(item.state == 0) {
        addressItem = (<View>
            <View style={styles.item}>
                <Text style={styles.itemLabel}>提货地址</Text>
                <Text style={styles.itemText}>{item.pickAddress}</Text>
            </View>
      </View>)
      } else {
        addressItem = (<View>
            <View style={styles.item}>
                <Text style={styles.itemLabel}>送货地址</Text>
                <Text style={styles.itemText}>{item.receiverAddress.split('-')[0]}</Text>
            </View>
        </View>)
      }
      return addressItem
    }
    _createEmptyView(){
        return (<View style={styles.none}>
            <Text style={styles.noneText}>~~暂无未完成订单~~</Text>
        </View>)
    }
    _onRefresh(){
        // this.setState({refreshing: true});
        this.getLogistList()
        // this.setState({refreshing: false});
    }
    render() {
        const {navigation} = this.props;
        const item = this.state.list

        return (<View style={styles.container}>
            <View style={styles.warnBox}>
                <Image
                    style={styles.warnImage}
                    source={require('../../res/images/icon-warn.png')}
                />
                <Text style={styles.warnTitle}>注：详细地址请拨打联系人电话</Text>
            </View>
            <FlatList data={this.state.list}
                renderItem={(data) => this._renderItem(data)}
                keyExtractor={(item) => item.list_num}
                ListEmptyComponent={this._createEmptyView}
                refreshControl= {
                    <RefreshControl
                        title= {'Loading'}
                        colors={['red']}
                        tintColor={'#0078DD'}
                        refreshing = {this.state.refreshing}
                        onRefresh = {() => {
                            this._onRefresh()
                        }}
                    />
                }
            />
            {/* <TouchableOpacity style={styles.button1} onPress={() => {
                this.getBasicUtils()
                }}>
                <Text style={styles.buttonText}>
                    位置
                </Text>
            </TouchableOpacity> */}
        </View>)
    }
    componentWillUnmount() {
      this.setState = (state,callback)=>{
       return
     }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    warnBox: {
        flexDirection: 'row',
        backgroundColor: '#F4FAFF',
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    warnImage: {
        width: 20,
        height: 20,
        marginRight: 6
    },
    warnTitle: {
        fontSize: 18,
        color: '#0078DD'
    },
    list: {
        marginTop: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 10,
        paddingBottom:15,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10
    },
    listTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10
    },
    fileImage: {
        width: 22,
        height: 22,
        marginRight: 5,
        marginLeft: 15
    },
    leftIcon: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    topTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 10
    },
    listBox: {
        marginTop: 10
    },
    item: {
        flexDirection: 'row',
        marginBottom: 5
    },
    itemLabel: {
        width: 92,
        marginRight: 12,
        color: '#979797',
        textAlign: 'right',
        fontSize: 18,
        lineHeight: 30
    },
    itemText: {
        fontSize: 18,
        flex: 1,
        lineHeight: 30
    },
    itemError:{
        color: 'red',
        fontSize: 18,
        lineHeight: 30
    },
    buttonBot: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button1: {
        // flex: 1,
        width:120,
        backgroundColor: '#0078DD',
        borderColor: '#0078DD',
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    button1Text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button2: {
        // flex: 1,
        width:120,
        // backgroundColor: '#EB4E35',
        height: 48,
        borderWidth: 1,
        borderColor: '#EB4E35',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    button2Text: {
        color: '#EB4E35',
        fontSize: 18,
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
