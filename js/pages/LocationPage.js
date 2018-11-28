/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
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
});
