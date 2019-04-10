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
    ScrollView
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
];
let Geolocation;
export default class Delivery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            list_num: '',
            step: 1,
            state: 2, //货物状态。2:确认提货；-2:无法提货
            abnormals_type: '', //异常状态选择。1：外包有异议；2：无装卸工；4：其他
            abnormals_describef: '',
            abnormals_describe: '',
            abnormalImgArr: [], //额外费用图片
            additional_charges: 0, //额外费用
            charges_detail: '', //费用明细
            imgPathArr: [], //货物图片
            location: {}
        }
    }
    componentWillMount() {
        const {params} = this.props.navigation.state;
        this.setState({token: params.token, list_num: params.list_num})

        // 定位发货地
        Geolocation = params.geolocation
        Geolocation.addLocationListener(location => {
            this.updateLocationState(location)
        });

        Geolocation.start();
    }
    //图片上传
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
    // 装货时异常选择
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

    renderSecondStep() {
        return (<View>
            <View style={styles.top}>
                <Text style={styles.title}>装货异常信息上报</Text>
            </View>
            <View style={styles.fromBox}>
                <View style={styles.inputContent}>
                    <Text style={styles.title}>异常选择：</Text>
                    <View style={styles.labelBox}>
                        {
                            abnormalsTypeArr.map((item, i, arr) => {
                                return (<TouchableOpacity key={i} style={this.state.abnormals_type == item.id
                                    ? [styles.labelButton, styles.activeBtn]
                                    : styles.labelButton} onPress={() => this.changeState('abnormals_type', item.id)}>
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
                    <Text style={styles.title}>异常描述：</Text>
                    <View style={styles.inputUnion}>
                        <TextInput autoCapitalize='none' placeholder="请输入异常信息" style={styles.textInput} multiline={true} onChangeText={(abnormals_describe) => this.setState({abnormals_describe})} value={this.state.abnormals_describe}/>
                    </View>
                </View>
                <View style={styles.inputContent}>
                    <Text style={styles.title}>图片上传：</Text>
                    <View style={styles.inputUnion}>
                        <CameraBtnUtils onChangeCamera={(type, val) => {
                            this.handleChangeAbnormalImg(type, val)
                        }}/>
                    </View>
                </View>
                <View style={styles.buttonBot}>
                    <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
                        this.getOrderDoingDetails()
                    }}>
                        <Text style={[styles.buttonText, styles.buttonBlue]}>
                            发货信息提交
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }

    updateLocationState(location) {
        if (location) {
            location.timestamp = Date.now();
            // location.timestamp = new Date(location.timestamp).toLocaleString();
            this.setState({location});
        }
    }
    async getOrderDoingDetails() {
        const param = this.state;
        if (this.state.abnormals_type && !this.state.abnormalImgArr.join(',')) {
            Alert.alert('提示', '需上传图片', [
                {
                    text: '确定',
                    onPress: () => {}
                }
            ])
            return
        }

        const params = "token=" + param.token + "&list_num=" + param.list_num + "&state=2" + "&abnormals_type=" + param.abnormals_type + "&abnormals_describef=" + param.abnormals_describef + "&abnormals_describe=" + param.abnormals_describe + "&abnormal_img=" + param.abnormalImgArr.join(',') + "&additional_charges=" + param.additional_charges + "&charges_detail=" + param.charges_detail + "&img_path=" + param.imgPathArr.join(',') + "&point=" + JSON.stringify(this.state.location);
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
            ])
        }
    }

    render() {
        // const {navigation} = this.props;
        return (<ScrollView style={styles.container}>
            {this.renderSecondStep()}
        </ScrollView>);
    }
    componentWillUnmount() {
        Geolocation.stop()
        this.setState = (state,callback)=>{
         return
       }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    warnBox: {
        flexDirection: 'row',
        backgroundColor: '#F4FAFF',
        padding: 10
    },
    warnImage: {
        marginRight: 6,
        color: '#0078DD',
    },
    warnTitle: {
        flex: 1,
        fontSize: 18,
        color: '#0078DD',
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
    inputContent: {
        marginTop: 10
    },
    title: {
        color: '#808080',
        fontSize: 16,
        marginVertical: 10,
        paddingHorizontal: 15
    },
    inputUnion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        backgroundColor: '#ffffff',
    },
    labelBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff'
    },
    labelButton: {
        height: 40,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginRight: 10,
        marginVertical: 5
    },
    btnText: {
        fontSize: 18,
        color: '#353535'
    },
    activeBtn: {
        backgroundColor: '#EB4E35',
        borderColor: '#EB4E35',
        color: '#fff'
    },
    buttonBot: {
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonOrange: {
        backgroundColor: '#ffffff',
        borderColor: '#EB4E35',
        borderWidth: 1
    },
    buttonTextOrange: {
        color: '#EB4E35',
    },
    buttonBlue: {
        backgroundColor: '#0078DD',
        borderColor: '#0078DD',
        color: '#ffffff'
    }
});
