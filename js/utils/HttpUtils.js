import React from 'react';
import {Alert} from 'react-native'
import Loading from './LoadingUtils'

export default class HttpUtils {
    static async GET(url, params, loading) {
        if(!loading) {
            Loading.show()
        }
        if (params) {
            var paramsArray = []
            Object.keys(params).forEach(key => paramsArray.push(key + "=" + params[key]))
            if (url.search(/\?/) === -1) {
                url += "?" + paramsArray.join("&")
            } else {
                url += "&" + paramsArray.join("&")
            }
        }
        try {
            let response = await fetch(url, {
                headers: {
                    "type": "app"
                }
            });
            let responseJson = await response.json();
            if(!loading) {
                Loading.hidden()
            }
            if (responseJson.meta.success == true) {
                return responseJson.data || true
            } else {
                Alert.alert('提示', responseJson.meta.message, [
                    {
                        text: '确定',
                        onPress: () => {}
                    }
                ],)
            }

        } catch (error) {
            console.error(error);
        }
    }
    static async POST(url, params, loading) {
        if(!loading) {
            Loading.show()
        }
        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "type": "app"
                },
                body: params
            });
            let responseJson = await response.json();
            if(!loading) {
                Loading.hidden()
            }

            if (responseJson.meta.success == true) {
                return responseJson.data || true
            } else if (responseJson.meta.state == '0') {
                return {state: true}
            } else {
                Alert.alert('提示', responseJson.meta.message, [
                    {
                        text: '确定',
                        onPress: () => {}
                    }
                ],)
            }
        } catch (error) {
            console.error(error);
        }
    }
    static UploadFile(url, images, params, loading) {
        if(!loading) {
            Loading.show()
        }
        let formData = new FormData();
        for (var key in params) {
            formData.append(key, params[key]);
        }
        let file = {
            uri: images.uri,
            type: 'multipart/form-data',
            name: 'file.jpg'
        };
        formData.append("file", file);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }).then((response) => response.json()).then((responseJson) => {
                if(!loading) {
                    Loading.hidden()
                }
                if (responseJson.meta.success == true) {
                    resolve(responseJson.data)
                } else {
                    Alert.alert('提示', responseJson.meta.message, [
                        {
                            text: '确定',
                            onPress: () => {}
                        }
                    ],)
                }
            }).catch(e => {
                if(!loading) {
                    Loading.hidden()
                }
                reject(error)
            })
        })
    }
}
