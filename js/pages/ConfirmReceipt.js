import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-picker'
import CameraBtnUtils from '../utils/CameraBtnUtils'
import {_getOrderDoneDetails} from '../servers/getData'
import NavigatorUtils from '../utils/NavigatorUtils'
import HttpUtils from '../utils/HttpUtils'

const abnormalsTypeArr = [
    {
        id: 9,
        name: '未接到到货通知'
    }, {
        id: 10,
        name: '外包有异议'
    }, {
        id: 11,
        name: '无装卸工'
    }, {
        id: 12,
        name: '其他'
    }
]
export default class ConfirmReceipt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            list_num: '',
            product_name: '',
            step: 1,
            state: 4, //货物状态。4:确认卸货；-4:无法卸货
            stateArr: [{id: 4,name: '确认卸货'},{id: -4,name: '无法卸货'}],
            abnormals_type: null, //异常状态选择。9：未接到到货通知；10：外包有异议；11：无装卸工；12：其他
            abnormals_describef: '',
            abnormals_describe: '',
            abnormalImgArr: [], //额外费用图片
            additional_charges: '', //额外费用
            charges_detail: '', //费用明细
            imgPathArr: [], //货物图片
        }
    }
    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({token: params.token, list_num: params.list_num, product_name: params.product_name})
    }
    handleChangeImgPath(type, val) {
        if (type) {
            this.setState({
                'imgPathArr': [
                    ...this.state.imgPathArr,
                    val.abnormal_img
                ]
            })
        } else {
            let data = this.state.imgPathArr;
            data.splice(val, 1);
            this.setState({imgPathArr: data})
        }
    }
    handleChangeAbnormalImg(type, val) {
        if (type) {
            this.setState({
                'abnormalImgArr': [
                    ...this.state.abnormalImgArr,
                    val.abnormal_img
                ]
            })
        } else {
            let data = this.state.abnormalImgArr;
            data.splice(val, 1);
            this.setState({abnormalImgArr: data})
        }
    }
    changeState(type, state) {
        if (type == 'abnormals_type') {
            let obj=abnormalsTypeArr.find(function (item) {
                return item.id === state
            })
            this.setState({[type]: state, abnormals_describef: obj.name})
        } else {
            this.setState({[type]: state})
        }
    }

    renderFristStep() {
        return (<View style={styles.fromBox}>
            <View style={styles.inputContent}>
                <Text style={styles.label}>物流单号：</Text>
                <Text style={styles.text}>{this.state.list_num}</Text>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>商品名称：</Text>
                <Text style={styles.text}>{this.state.product_name}</Text>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>货物状态：</Text>
                {this.state.stateArr.map((item, i, arr) => {
                    return (<TouchableOpacity style={this.state.state == item.id
                        ? [styles.button, styles.activeBtn]
                        : styles.button} onPress={() => this.changeState('state', item.id)}>
                        <Text style={this.state.state == item.id
                            ? [styles.buttonText, styles.activeBtn]
                            : styles.buttonText}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>)
                })}
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>异常选择：</Text>
                <View style={styles.labelBox}>
                    {abnormalsTypeArr.map((item, i, arr) => {
                        return (<TouchableOpacity key={i} style={this.state.abnormals_type == item.id
                            ? [styles.button, styles.activeBtn]
                            : styles.button} onPress={() => this.changeState('abnormals_type', item.id)}>
                            <Text style={this.state.abnormals_type == item.id
                                ? [styles.buttonText, styles.activeBtn]
                                : styles.buttonText}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>)
                    })}
                </View>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>异常描述：</Text>
                <TextInput autoCapitalize='none' style={styles.textInput} multiline={true} onChangeText={(abnormals_describe) => this.setState({abnormals_describe})} value={this.state.abnormals_describe}/>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>图片上传：</Text>
                <CameraBtnUtils onChangeCamera={(type, val) => {
                    this.handleChangeImgPath(type, val)
                }}/>
            </View>
            <View style={styles.inputContent}>
                <TouchableOpacity style={styles.buttonOk} onPress={() => {
                        this.nextStep()
                    }}>
                    <Text style={styles.buttonOkText}>
                        下一步
                    </Text>
                </TouchableOpacity>
            </View>
        </View>)
    }
    nextStep() {
        if (this.state.state == '-4' && !this.state.abnormals_type) {
            Alert.alert('提示', '需选择异常类型', [
                {
                    text: '确定',
                    onPress: () => {}
                }
            ])
            return
        }
        if (this.state.abnormals_type && !this.state.imgPathArr.join(',')) {
            Alert.alert('提示', '需上传图片', [
                {
                    text: '确定',
                    onPress: () => {}
                }
            ])
            return
        }
        this.setState({step: 2})
    }
    renderSecondStep() {
        return (<View style={styles.fromBox}>
            <View style={styles.inputContent}>
                <Text style={styles.label}>物流单号：</Text>
                <Text style={styles.text}>{this.state.list_num}</Text>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>商品名称：</Text>
                <Text style={styles.text}>{this.state.product_name}</Text>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>额外费用：</Text>
                <TextInput autoCapitalize='none' style={styles.textInput} keyboardType="decimal-pad" onChangeText={(additional_charges) => this.setState({additional_charges})} value={this.state.additional_charges}/>
                <Text style={styles.label}>元</Text>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>费用明细：</Text>
                <TextInput autoCapitalize='none' style={styles.textInput} multiline={true} onChangeText={(charges_detail) => this.setState({charges_detail})} value={this.state.charges_detail}/>
            </View>
            <View style={styles.inputContent}>
                <Text style={styles.label}>图片上传：</Text>
                <CameraBtnUtils onChangeCamera={(type, val) => {
                    this.handleChangeAbnormalImg(type, val)
                }}/>
            </View>
            <View style={styles.inputContent}>
                <TouchableOpacity style={styles.buttonOk} onPress={() => {
                    this.getOrderDoneDetails()
                    }}>
                    <Text style={styles.buttonOkText}>
                        确定
                    </Text>
                </TouchableOpacity>
            </View>
        </View>)
    }
    async getOrderDoneDetails() {
        console.log(this.state);
        const param = this.state;
        const params = "token=" + param.token + "&list_num=" + param.list_num + "&state=" + param.state + "&abnormals_type=" + param.abnormals_type + "&abnormals_describef=" + param.abnormals_describef + "&abnormals_describe=" + param.abnormals_describe + "&abnormal_img=" + param.abnormalImgArr.join(',') + "&additional_charges=" + param.additional_charges + "&charges_detail=" + param.charges_detail + "&img_path=" + param.imgPathArr.join(',');

        let res = await HttpUtils.POST(_getOrderDoneDetails, params);
        if (res) {
            Alert.alert('提示', '卸货信息提交成功', [
                {
                    text: '确定',
                    onPress: () => {
                        NavigatorUtils.resetToHomepage({navigation: this.props.navigation});
                    }
                }
            ],)
        }
    }

    render() {
        const {navigation} = this.props;
        return (<View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>装备卸货，上传信息</Text>
            </View>
            {
                this.state.step == 1
                    ? this.renderFristStep()
                    : this.renderSecondStep()
            }
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    top: {
        marginTop: 35,
        marginLeft: 12,
        marginRight: 12,
        paddingLeft: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#0078DD'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#353535'
    },
    fromBox: {
        marginTop: 35,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 10
    },
    inputContent: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: '#888888',
        fontSize: 14
    },
    labelBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 14
    },
    button: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#B2B2B2',
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 15,
    },
    buttonOk: {
        flex: 1,
        backgroundColor: '#0078DD',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonText: {
        color: '#B2B2B2'
    },
    buttonOkText: {
        fontSize: 18,
        color: '#fff'
    },
    activeBtn: {
        borderColor: '#0078DD',
        color: '#0078DD'
    },
    textInput: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 4,
        fontSize: 18
    }
});
