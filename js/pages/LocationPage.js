/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, AppState, ScrollView,
    TouchableOpacity,
    ToastAndroid,
    PermissionsAndroid,} from 'react-native';
import {Geolocation} from "react-native-amap-geolocation"
import BackgroundTimer from 'react-native-background-timer'

export default class LocationPage extends Component {
   state = {
       location: {},
       locations: [],
       timestamp: '',
       startTime: '',
       id: '',
       appState: AppState.currentState
    };

  async componentDidMount() {
    await Geolocation.init({
      ios: "a421265fe274bd3e2863ac0fcefde36b",
      android: "68b927bf24f7185ac2a06049c69c3148"
    });
    Geolocation.setOptions({
      interval: 10000,
      distanceFilter: 10,
      // background: true,
      reGeocode: true
    });



    BackgroundTimer.runBackgroundTimer(() => {
    //code that will be called every 3 seconds
        console.log('定时器');
        this.setState({id: this.state.id ++})
    },
    3000);

    global.storage
      .load({
        key: 'startTime'
      })
      .then(ret => {
        this.setState({startTime: ret})
      })
      .catch(err => {
          const time =  Date.now
          global.storage.save({
              key: 'startTime',
              data:time
            });
            this.setState({startTime: time})
      });

    Geolocation.addLocationListener(location => {
      console.log(222);
      this.updateLocationState(location)

    });

      // console.log(1111);
      Geolocation.start();
  }

  componentWillUnmount() {
    // Geolocation.stop();
    this.timer && clearTimeout(this.timer);
    console.log('location:componentWillUnmount');
    this.setState = (state,callback)=>{
     return;
   };
  }
  updateLocationState(location) {
    if (location) {
        location.timestamp = Date.now();
      // location.timestamp = new Date(location.timestamp).toLocaleString();
      // this.setState({ location, locations: [...this.state.locations, location] });
      if(location.timestamp!==this.state.timestamp) {
          this.setState({ location, timestamp: location.timestamp});
          console.log(location);
          global.storage.save({
              key: 'locationArr', // 注意:请不要在key中使用_下划线符号!
              id: location.timestamp,
              data: location,
              expires: null
            });
        }
      if(location.timestamp-this.state.startTime >3000) {
          this.getLocations()
      }
    }
  }
   getLocations() {
        global.storage.getAllDataForKey('locationArr').then(users => {
          console.log('users:' + users);
        }).catch(err => {
            console.warn(err.message);
          });;
  }
  clearMapForKey() {
      global.storage.clearMapForKey('locationArr');

  }

  startLocation = () => {
    console.log(1111);
    Geolocation.start();
  }
  stopLocation = () => {Geolocation.stop();}
  getLastLocation = async () =>
    this.updateLocationState(await Geolocation.getLastLocation());

    render() {
      const { location } = this.state;
    return (
      <ScrollView style={style.body}>
        <View style={style.controls}>
          <Button
            style={style.button}
            onPress={this.startLocation}
            title="开始定位"
          />
          <Button
            style={style.button}
            onPress={this.stopLocation}
            title="停止定位"
          />
        </View>
        <Text>{this.state.id}</Text>
        {Object.keys(location).map(key => (
          <View style={style.item} key={key}>
            <Text style={style.label}>{key}</Text>
            <Text>{location[key]}</Text>
          </View>
        ))}

        <View style={style.container}>
              <TouchableOpacity style={style.button_view}
                  onPress={()=>this.getLocations()}>
                  <Text style={style.button_text}>getLocations</Text>
              </TouchableOpacity>
                    <TouchableOpacity style={style.button_view}
                        onPress={()=>this.clearMapForKey()}>
                        <Text style={style.button_text}>clearMapForKey</Text>
                    </TouchableOpacity>
              <TouchableOpacity style={style.button_view}
                  onPress={this.requestReadPermission.bind(this)}>
                  <Text style={style.button_text}>申请读写权限</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.button_view}
                  onPress={this.requestCarmeraPermission.bind(this)}>
                  <Text style={style.button_text}>申请相机权限</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.button_view}
                  onPress={this.requestLocationPermission.bind(this)}>
                  <Text style={style.button_text}>申请访问地址权限</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.button_view}
                                onPress={this.checkPermission.bind(this)}>
                  <Text style={style.button_text}>查询是否获取了读写权限</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.button_view}
                                onPress={this.requestMultiplePermission.bind(this)}>
                  <Text style={style.button_text}>一次申请所以权限</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
    );
    }

    show(data) {
        ToastAndroid.show(data,ToastAndroid.SHORT)
    }

    /*
    * 弹出提示框向用户请求某项权限。返回一个promise，最终值为用户是否同意了权限申请的布尔值。
    * 其中rationale参数是可选的，其结构为包含title和message)的对象。
    * 此方法会和系统协商，是弹出系统内置的权限申请对话框，
    * 还是显示rationale中的信息以向用户进行解释。
    * */
    async requestReadPermission() {
        try {
            //返回string类型
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要读写权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.show("你已获取了读写权限")
            } else {
                this.show("获取读写权限失败")
            }
        } catch (err) {
            this.show(err.toString())
        }
    }

    async requestCarmeraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要相机权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.show("你已获取了相机权限")
            } else {
                this.show("获取相机失败")
            }
        } catch (err) {
            this.show(err.toString())
        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要地址查询权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.show("你已获取了地址查询权限")
            } else {
                this.show("获取地址查询失败")
            }
        } catch (err) {
            this.show(err.toString())
        }
    }

    checkPermission() {
        try {
            //返回Promise类型
            const granted = PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            granted.then((data)=>{
                this.show("是否获取读写权限"+data)
            }).catch((err)=>{
                this.show(err.toString())
            })
        } catch (err) {
            this.show(err.toString())
        }
    }

    async requestMultiplePermission() {
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.CAMERA
            ]
            //返回得是对象类型
            const granteds = await PermissionsAndroid.requestMultiple(permissions)
            var data = "是否同意地址权限: "
            if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
                data = data + "是\n"
            } else {
                data = data + "否\n"
            }
            data = data+"是否同意相机权限: "
            if (granteds["android.permission.CAMERA"] === "granted") {
                data = data + "是\n"
            } else {
                data = data + "否\n"
            }
            data = data+"是否同意存储权限: "
            if (granteds["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {
                data = data + "是\n"
            } else {
                data = data + "否\n"
            }
            this.show(data)
        } catch (err) {
            this.show(err.toString())
        }
    }
}

const style = StyleSheet.create({
  body: {
    padding: 16
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginBottom: 24
  },
  item: {
    flexDirection: "row",
    marginBottom: 4
  },
  label: {
    color: "#f5533d",
    width: 120,
    paddingRight: 10,
    textAlign: "right"
  },

  container: {
        // flex: 1,
        padding: 10,
    },
    button_view: {
        margin:4,
        borderRadius: 4,
        backgroundColor: '#8d4dfc',
        alignItems: 'center',
    },
    button_text: {
        padding: 6,
        fontSize: 16,
        fontWeight: '600'
    }
});
