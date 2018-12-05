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
    TouchableOpacity,
    FlatList,
    ScrollView
} from 'react-native';

import {_getLogistDetails} from '../servers/getData'
import NavigatorUtils from '../utils/NavigatorUtils'
import HttpUtils from '../utils/HttpUtils'

type Props = {};
export default class ListDetails extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            list_num: '',
            items: {}
        }
    }
    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            token: params.token,
            list_num: params.list_num
        }, ()=> {
            this.getDetails()
        })
    }
    async getDetails() {
        const params = "token=" + this.state.token + "&list_num=" + this.state.list_num ;
        // const params = "token=a8802b38-f292-4655-92c0-f928eb5cfa70&list_num=Q20181130113647"
        let res = await HttpUtils.POST(_getLogistDetails, params)
        console.log(res);
        if(res) {
            this.setState({
                items: res
            })
        }
    }
    _renderPic(end_img_path, img_path) {

        let picString = img_path ? end_img_path + ',' + img_path : end_img_path
        let avatarSource = picString && picString.split(',')
        if (avatarSource.length > 0) {
            return (<View style={styles.upload}>
                {
                    avatarSource.map((result, i, arr) => {
                        return (<View key={i} style={styles.avatarBox}>
                            <Image style={styles.avatar}
                                source={{uri: result}}/>
                        </View>)
                    })
                }
            </View>)
        }
    }
    _renderFlatListItem(data) {
        return (<View style={styles.listBox}>
            <View style={styles.item}>
                <Text style={styles.itemLabel}>异常描述</Text>
                <Text style={styles.itemText}>{data.abnormal_describe}</Text>
            </View>
            { data.abnormal_img ? (<View style={styles.item}>
                <Text style={styles.itemLabel}>费用凭证</Text>
                {this._renderPic(data.abnormal_img)}
            </View>) : null}
        </View>)
    }
    _renderItem(item){
        console.log('item' + item);
        let BoxView
        if(Object.keys(item).length == 0) {
            BoxView = <View style={styles.box}><Text>暂无数据</Text></View>
        } else {
            BoxView = (<View style={styles.box}>
                <View style={styles.listBox}>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>订单号</Text>
                        <Text style={styles.itemText}>{item.list_num}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>商品名称</Text>
                        <Text style={styles.itemText}>{item.entru.product.name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>数量</Text>
                        <Text style={styles.itemText}>{item.entru.product.count}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>发货地址</Text>
                        <Text style={styles.itemText}>{item.entru.warehouse.address}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>收货地址</Text>
                        <Text style={styles.itemText}>{item.entru.receiver.address}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>公司名称</Text>
                        <Text style={styles.itemText}>{item.entru.receiver.name}</Text>
                    </View>
                </View>
                <View style={styles.listBox}>
                    { item.additional_charges ? (<View style={styles.item}>
                        <Text style={styles.itemLabel}>额外费用</Text>
                        <Text style={styles.itemText}>{item.additional_charges}</Text>
                    </View>) : null}
                    { item.charges_detail ? (<View style={styles.item}>
                        <Text style={styles.itemLabel}>费用明细</Text>
                        <Text style={styles.itemText}>{item.charges_detail}</Text>
                    </View>) : null}
                    { item.end_img_path ? (<View style={styles.item}>
                        <Text style={styles.itemLabel}>费用凭证</Text>
                        {this._renderPic(item.end_img_path, item.img_path)}
                    </View>) : null}
                </View>

                <View style={styles.listBox}>
                    <Text styles={styles.listTop}>异常</Text>
                    <FlatList data={item.abnormals}
                        renderItem={(data) => this._renderFlatListItem(data.item)}
                        keyExtractor={(item, index) => item.abnormal_describe}
                        ListEmptyComponent={this._createEmptyView}
                    />
                </View>
            </View>)
        }
        return BoxView
    }
    render() {
        return (<ScrollView style={styles.container}>
            {/* <TouchableOpacity onPress={ () => {
                this.getDetails()
                }}>
                <Text>获取列表</Text>
            </TouchableOpacity> */}
            {this._renderItem(this.state.items)}
        </ScrollView>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    box: {
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
        fontSize: 28
    },
    listBox: {
        marginTop: 10
    },
    item: {
        flexDirection: 'row',
        marginBottom: 5
    },
    itemLabel: {
        width: 65,
        marginRight: 12,
        color: '#888888',
        textAlign: 'right',
    },
    upload: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    avatarBox: {
        position: 'relative'
    },
    avatar: {
        borderRadius: 5,
        width: 90,
        height: 90,
        marginRight: 10,
        marginBottom: 10
    },
});
