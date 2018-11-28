/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
<<<<<<< HEAD
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {Geolocation} from "react-native-amap-geolocation"

export default class LocationPage extends Component {
   state = { location: {} };

  async componentDidMount() {
    await Geolocation.init({
      ios: "a421265fe274bd3e2863ac0fcefde36b",
      android: "68b927bf24f7185ac2a06049c69c3148"
    });
    Geolocation.setOptions({
      interval: 10000,
      distanceFilter: 10,
      background: true,
      reGeocode: true
    });
    Geolocation.addLocationListener(location => {
      console.log(222);
      this.updateLocationState(location)

    }
    );
  }

  // componentWillUnmount() {
  //   Geolocation.stop();
  // }

  updateLocationState(location) {
    if (location) {
      location.timestamp = new Date(location.timestamp).toLocaleString();
      this.setState({ location });
      console.log(location);
    }
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
      <View style={style.body}>
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
        {Object.keys(location).map(key => (
          <View style={style.item} key={key}>
            <Text style={style.label}>{key}</Text>
            <Text>{location[key]}</Text>
          </View>
        ))}
      </View>
    );
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
  }
=======
import {Platform, StyleSheet, Text, View, Button, FlatList} from 'react-native';
import {Geolocation} from "react-native-amap-geolocation"

// let points = []
export default class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: '',
            points: []
        }
    }
    async componentWillMount() {
        await Geolocation.init({ios: "9bd6c82e77583020a73ef1af59d0c759", android: "043b24fe18785f33c491705ffe5b6935"})
    }
    componentDidMount() {

        Geolocation.setOptions({interval: 8000, distanceFilter: 20})
        Geolocation.addLocationListener(location => {
            this.updateLocationState(location)
            // setParams({location: location})
            // this.setState({location});
            // console.log(location)
        })
    }
    render() {
        const location = this.state.location
        return (<View style={style.container}>
            <View style={style.controls}>
                <Button style={style.button} onPress={() => Geolocation.start()} title="开始定位"/>
                <Button style={style.button} onPress={() => Geolocation.stop()} title="停止定位"/>
            </View>
            {
                Object.keys(location).map(key => (<View style={style.item} key={key}>
                    <Text style={style.label}>{key}</Text>
                    <Text>{location[key]}</Text>
                </View>))
            }
            <Text>点集合</Text>
            <FlatList
                data={this.state.points}
                renderItem={({item}) => <View style={{}}>
                    <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                        <Text>latitude: </Text>
                        <Text>{item.latitude}</Text>
                        <Text>timestamp: </Text>
                        <Text>{item.timestamp}</Text>
                        <Text>longitude: </Text>
                        <Text>{item.longitude}</Text>
                    </View>
                </View>}
            />
        </View>);
    }
    updateLocationState(location) {
        if (location) {
            location.timestamp = new Date(location.timestamp).toLocaleString();
            // points.push({latitude: location.latitude,longitude:location.longitude, timestamp: location.timestamp})
            this.setState({location, points: [...this.state.points,location]});
            console.log(location)
            console.log(this.state.points)
        }
    }

    startLocation = () => {
        Geolocation.start();
    };
    stopLocation = () => {
        Geolocation.stop();
    };
    getLastLocation = async () => {
        this.updateLocationState(await Geolocation.getLastLocation())
    };
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    controls: {},
    button: {},
    item: {},
    label: {}

>>>>>>> 442dd32315d8a530d9efd848e86c65ff6bc3d8cd
});
