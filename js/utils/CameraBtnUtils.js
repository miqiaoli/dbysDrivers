import React, {Component} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
    View,
    Text,
    Image,
    FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-picker'

import {_getImgUrl} from '../servers/getData'
import HttpUtils from '../utils/HttpUtils'

export default class CameraBtnUtils extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSource: []
        }
    }
    //选择图片
    selectPhotoTapped() {
        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            let source = {
                uri: response.uri
            };
            this.setState({
                'avatarSource': [
                    ...this.state.avatarSource,
                    source
                ]
            })
            this.uploadPic(source)
        });
    }
    uploadPic(image) {
        HttpUtils.UploadFile(_getImgUrl, image).then(res => {
            this.props.onChangeCamera(1, res) //0表示减少图片，1表示添加图片
        }).catch(error => {
            console.error(error);
        });
    }
    dletePhoto(index) {
        let data = this.state.avatarSource;
        data.splice(index, 1);
        this.setState({avatarSource: data})
        this.props.onChangeCamera(0, index)
    }

    _renderPic() {
        if (this.state.avatarSource.length > 0) {
            return (<View style={styles.upload}>
                {
                    this.state.avatarSource.map((result, i, arr) => {
                        return (<View key={i} style={styles.avatarBox}>
                            <Image style={styles.avatar} source={result}/>
                            <TouchableOpacity style={styles.icon} onPress={this.dletePhoto.bind(this, i)}>
                                <Icon name="closecircle" size={20} color="#979797"/>
                            </TouchableOpacity>

                        </View>)
                    })
                }
            </View>)
        }
    }
    _renderAddPic() {
        let renderAddPic;
        if (this.state.avatarSource.length < 3) {
            renderAddPic = (<TouchableOpacity style={[styles.avatar, styles.uploadPic]} onPress={this.selectPhotoTapped.bind(this)}>
                <Icon name="plus" size={30} color="#979797"/>
            </TouchableOpacity>)
        }
        return renderAddPic
    }
    render() {
        return (<View style={styles.upload}>
            {this._renderPic()}
            {this._renderAddPic()}
        </View>)
    }
}

const styles = StyleSheet.create({
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
        marginRight: 15
    },
    icon: {
        position: 'absolute',
        right: 5,
        top: -10
    },
    uploadPic: {
        borderColor: '#888',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
