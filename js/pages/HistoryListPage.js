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
import {_getLogout, _getLogistList} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'
import NavigatorUtils from '../utils/NavigatorUtils'
import Icon from 'react-native-vector-icons/AntDesign'

type Props = {};
export default class HomePage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            page_start: 1,
            page_limit: 5,
            list: [],
            counts: null, //总条数
            isLoading: false
        }
    }
    componentDidMount() {
        const {params} = this.props.navigation.state;

        this.setState({
            token: params.token
        }, () => {
            // this.getLogistList()
        })
    }
    getLogout() {
      const {navigation} = this.props;
      Alert.alert('提示', '确定退出该账户？', [
          {
              text: '取消',
              style: 'cancel'
          }, {
              text: '确定',
              onPress: () => {
                  fetch(_getLogout, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                      },
                      body: "token=" + this.state.token
                  }).then(res => {
                      global.storage.clearMapForKey('user');
                      NavigatorUtils.resetToLogin({navigation: navigation});
                  });
              }
          }
      ], {cancelable: false})
    }
    async getLogistList() {
        let res = await HttpUtils.GET(_getLogistList, {
            token: this.state.token,
            page_start: this.state.page_start,
            page_limit: this.state.page_limit
        });
        if (res) {
            if (this.state.page_start === 1) {
                this.setState({
                    list: res.data,
                    counts: Math.ceil(res.count / this.state.page_limit)
                })

            } else {
                this.setState({
                    list: this.state.list.concat(res.data)
                })
            }
        }
    }
    _onRefresh() {
        this.setState({
            page_start: 1
        }, () => {
            this.getLogistList()
        });
    }
    genIndicator(page_start) {
        let renderView;
        if (page_start < this.state.counts) { //下拉刷新
            renderView = (<View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} size="large" color="#0078DD"/>
                <Text>正在加载中。。。。</Text>
            </View>)
        } else { //下拉触底
            renderView = (<View style={styles.indicatorContainer}>
                <Text>
                    -
                </Text>
            </View>)
        }
        return renderView
    }
    loadData(page_start) {
        if (page_start < this.state.counts) {
            this.setState({
                page_start: page_start + 1
            }, () => {
                this.getLogistList()
            });
        }
    }
    renderButton(state) {
        let ButtonView;
        if (state == '0') {
            ButtonView = (<Text>待发货</Text>);
        } else if (state == '1' || state == '2' || state == '3') {
            ButtonView = (<Text>配送中</Text>);
        } else {
            ButtonView = (<Text>已完成</Text>);
        }
        return ButtonView
    }
    _renderItem(data) {
        const {item} = data, {navigation} = this.props;

        return (<View style={styles.list}>
            <View style={styles.listContainer}>
                <View style={styles.listTop}>
                    <Icon name="filetext1" size={22} color="#979797"/>
                    <Text style={styles.topTitle}>{item.list_num}</Text>
                    <TouchableOpacity style={styles.listTop} onPress={() => navigation.navigate('ListDetails', {
                            token: this.state.token,
                            list_num: item.list_num
                        })}>
                        {this.renderButton(item.state)}
                        <Icon name="right" size={20} color="#888888"/>
                    </TouchableOpacity>
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
            </View>
        </View>)
    }
    render() {
        return (<View style={styles.container}>

            {/* <FlatList data={this.state.list} renderItem={(data) => this._renderItem(data)} keyExtractor={(item, index) => item.list_num} ListEmptyComponent={this._createEmptyView} refreshControl="refreshControl" {
                <RefreshControl
                    title= {'Loading'}
                    colors={['red']}
                    tintColor={'#0078DD'}
                    refreshing = {this.state.isLoading}
                    onRefresh = {() => {
                this._onRefresh()
                    }}
                />
                } ListFooterComponent="ListFooterComponent" {()=>
                this.genIndicator(this.state.page_start)
                } onEndReachedThreshold='0.1' onEndReached="onEndReached" {() => {
                this.loadData(this.state.page_start)
            }}/> */}
            <View style={styles.item}>
                <Text style={styles.button1}>Version1 2.0.313</Text>
            </View>
            <View style={styles.buttonBot}>
                <TouchableOpacity style={styles.button1} onPress={() => {
                    this.getLogout()
                }}>
                    <Text style={styles.buttonText}>
                        退出登录
                    </Text>
                </TouchableOpacity>
            </View>
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
        alignItems: 'center',
        justifyContent: 'center'
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
        textAlign: 'right',
        lineHeight: 24
    },
    itemText: {
        flex: 1,
        lineHeight: 24
    },
    buttonBot: {
        flexDirection: 'row'
    },
    button1: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        textAlign: 'center'
    },
    buttonText: {
        color: '#0078DD'
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        marginBottom: 20
    }
});
