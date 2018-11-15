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
import {_getOrderWarningDetails} from '../servers/getData'
import NavigatorUtils from '../utils/NavigatorUtils'
import HttpUtils from '../utils/HttpUtils'

const abnormalsTypeArr = [
    {
        id: 5,
        name: '车辆异常'
    }, {
        id: 6,
        name: '交通事故'
    }, {
        id: 7,
        name: '超载查扣'
    }, {
        id: 8,
        name: '其他'
    }
]
export default class Delivering extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            list_num: '',
            product_name: '',
            state: 2, //货物状态。2:确认提货；-2:无法提货
            abnormals_type: null, //异常状态选择。1：外包有异议；2：无装卸工；4：其他
            abnormals_describef: '',
            abnormals_describe: '',
            abnormalImgArr: [], //运输过程中异常上报图片
        }
    }
    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({token: params.token, list_num: params.list_num, product_name: params.product_name})
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
        const {navigation} = this.props;
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
                    this.handleChangeAbnormalImg(type, val)
                }}/>
            </View>
            <View style={styles.inputContent}>
                <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                    navigation.goBack()
                }}>
                    <Text style={styles.buttonCancelText}>
                        取消
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOk} onPress={() => {
                    this.getOrderWarningDetails()
                }}>
                    <Text style={styles.buttonOkText}>
                        确定
                    </Text>
                </TouchableOpacity>
            </View>
        </View>)
    }

    async getOrderWarningDetails() {
        const param = this.state;
        console.log(param);
        if (param.abnormals_type && !param.abnormalImgArr.join(',')) {
            Alert.alert('提示', '需上传图片', [
                {
                    text: '确定',
                    onPress: () => {}
                }
            ])
            return
        }
        const params = "token=" + param.token + "&list_num=" + param.list_num  + "&abnormals_type=" + param.abnormals_type + "&abnormals_describef=" + param.abnormals_describef + "&abnormals_describe=" + param.abnormals_describe + "&abnormal_img=" + param.abnormalImgArr.join(',');

        let res = await HttpUtils.POST(_getOrderWarningDetails, params);
        if (res) {
            Alert.alert('提示', '异常信息上报提交成功', [
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
        return (<View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>运输途中异常上报</Text>
            </View>
            {this.renderFristStep()}
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
        alignItems: 'center'
    },
    labelBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    label: {
        color: '#888888',
        fontSize: 14
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
        marginBottom: 15
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
    buttonCancel: {
        flex: 1,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 15,
        paddingBottom: 15,
        borderWidth: 1,
        borderColor: '#B2B2B2',
        borderRadius: 5,
        marginTop: 20,
        marginRight: 20,
        alignItems: 'center'

    },
    buttonText: {
        color: '#B2B2B2'
    },
    buttonOkText: {
        fontSize: 18,
        color: '#fff'
    },
    buttonCancelText:{
        fontSize: 18,
        color: '#B2B2B2'
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
