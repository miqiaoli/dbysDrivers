import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    dismissKeyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-picker'
import CameraBtnUtils from '../utils/CameraBtnUtils'
import {_getOrderDoingDetails} from '../servers/getData'
import NavigatorUtils from '../utils/NavigatorUtils'
import HttpUtils from '../utils/HttpUtils'

const abnormalsTypeArr = [
    {
        id: 1,
        name: '包装破损'
    }, {
        id: 4,
        name: '其他'
    }
]
export default class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            list_num: '',
            step: 1,
            state: 2, //货物状态。2:确认提货；-2:无法提货
            stateArr: [
                {
                    id: 2,
                    name: '确认提货'
                }, {
                    id: -2,
                    name: '无法提货'
                }
            ],
            abnormals_type: '', //异常状态选择。1：外包有异议；2：无装卸工；4：其他
            abnormals_describef: '',
            abnormals_describe: '',
            abnormalImgArr: [], //额外费用图片
            additional_charges: '', //额外费用
            charges_detail: '', //费用明细
            imgPathArr: [], //货物图片
            location: {}
        }
    }
    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({token: params.token, list_num: params.list_num, geolocation: params.geolocation})
        console.log('geolocation: ' + params.geolocation);
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
            if (this.state.abnormals_type == state) {
                this.setState({[type]: '', abnormals_describef: ''})
            } else {
                let obj = abnormalsTypeArr.find(function(item) {
                    return item.id === state
                })
                this.setState({[type]: state, abnormals_describef: obj.name})
            }

        } else {
            this.setState({[type]: state})
        }
    }

    renderFristStep() {
        return (<View>
            <View style={styles.top}>
                <Text style={styles.title}>异地装车费用上报</Text>
            </View>
            <View style={styles.warnBox}>
                <Text style={styles.warnTitle}>注：无费用时，无需填写，发生费用时，需上传凭证</Text>
            </View>
            <View style={styles.fromBox}>
                <View style={styles.inputContent}>
                    <Text style={styles.label}>费用汇总：</Text>
                    <View style={styles.inputUnion}>
                        <Text style={styles.label}>￥</Text>
                        <TextInput autoCapitalize='none' style={styles.textInput} keyboardType="decimal-pad" onChangeText={(additional_charges) => this.setState({additional_charges})} value={this.state.additional_charges}/>
                    </View>
                </View>
                {/* <View style={styles.inputContent}>
                    <Text style={styles.label}>无凭证费用明细：</Text>
                    <TextInput autoCapitalize='none' style={styles.textInput} multiline={true} onChangeText={(charges_detail) => this.setState({charges_detail})} value={this.state.charges_detail}/>
                </View> */
                }
                <View style={styles.inputContent}>
                    <Text style={styles.label}>上传费用凭证：</Text>
                    <CameraBtnUtils onChangeCamera={(type, val) => {
                            this.handleChangeAbnormalImg(type, val)
                        }}/>
                </View>
                <View style={styles.buttonBot}>
                    <TouchableOpacity style={styles.button2} onPress={() => {
                            this.nextStep()
                        }}>
                        <Text style={styles.buttonText}>
                            上报异常
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button1} onPress={() => {
                            this.getOrderDoingDetails()
                        }}>
                        <Text style={styles.buttonText}>
                            正常装货
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }
    nextStep() {
        if (this.state.state == '-2' && !this.state.abnormals_type) {
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
        this.setState({step: 2, state: 2})
    }
    renderSecondStep() {
        return (<View>
            <View style={styles.top}>
                <Text style={styles.title}>装货异常信息上报</Text>
            </View>
            <View style={styles.fromBox}>
                <View style={styles.inputContent}>
                    <Text style={styles.label}>异常选择：</Text>
                    <View style={styles.labelBox}>
                        {
                            abnormalsTypeArr.map((item, i, arr) => {
                                return (<TouchableOpacity key={i} style={this.state.abnormals_type == item.id
                                        ? [styles.button, styles.activeBtn]
                                        : styles.button} onPress={() => this.changeState('abnormals_type', item.id)}>
                                    <Text style={this.state.abnormals_type == item.id
                                            ? [styles.btnText, styles.activeBtn]
                                            : styles.btnText}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>)
                            })
                        }
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
                <View style={styles.buttonBot}>
                    <TouchableOpacity style={styles.button2} onPress={() => {
                            this.getOrderDoingDetails()
                        }}>
                        <Text style={styles.buttonText}>
                            异常提交
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }

    updateLocationState(location) {
        if (location) {
            location.timestamp = new Date(location.timestamp).toLocaleString();
            this.setState({location});
            // console.log(location);
        }
    }
    async getLastLocation(){
        this.updateLocationState(await this.state.geolocation.getLastLocation())
    }
    async getOrderDoingDetails() {
        // console.log(this.state);
        const param = this.state;
        const additional_charges = param.additional_charges
            ? param.additional_charges
            : 0;

        const params = "token=" + param.token + "&list_num=" + param.list_num + "&state=2" + "&abnormals_type=" + param.abnormals_type + "&abnormals_describef=" + param.abnormals_describef + "&abnormals_describe=" + param.abnormals_describe + "&abnormal_img=" + param.abnormalImgArr.join(',') + "&additional_charges=" + additional_charges + "&charges_detail=" + param.charges_detail + "&img_path=" + param.imgPathArr.join(',') + "&point=" + JSON.stringify(this.state.location);
        console.log(params);
        // return
        let res = await HttpUtils.POST(_getOrderDoingDetails, params);
        if (res) {
            Alert.alert('提示', '发货信息提交成功', [
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
        return (<ScrollView style={styles.container}>
            {
                this.state.step == 1
                    ? this.renderFristStep()
                    : this.renderSecondStep()
            }
        </ScrollView>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    warnBox: {
        flex: 1,
        backgroundColor: '#F4FAFF',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20,
        paddingHorizontal: 12
    },
    warnTitle: {
        fontSize: 18,
        color: '#0078DD'
    },
    top: {
        marginTop: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#353535'
    },
    fromBox: {
        marginTop: 20,
        marginBottom: 10
    },
    inputContent: {
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 20
    },
    inputUnion: {
        flexDirection: 'row'
    },
    label: {
        color: '#888888',
        fontSize: 20,
        marginBottom: 14
    },
    labelBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    text: {
        fontSize: 14
    },
    button: {
        width: 150,
        height: 50,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginBottom: 15
    },
    activeBtn: {
        backgroundColor: '#EB4E35',
        borderColor: '#EB4E35',
        color: '#fff'
    },
    btnText: {
        fontSize: 24,
        color: '#353535'
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        borderColor: '#979797',
        borderBottomWidth: 1
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
    }
});
