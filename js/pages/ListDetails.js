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
} from 'react-native';

type Props = {};
export default class HomePage extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {

        return (<View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.listBox}>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>商品名称</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>数量</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>收货地址</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>联系方式</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                </View>
            </View>
            <View style={styles.box}>
                <View style={styles.listBox}>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>商品名称</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>数量</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>收货地址</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemLabel}>联系方式</Text>
                        <Text style={styles.itemText}>XXXXXXXXX</Text>
                    </View>
                </View>
            </View>
        </View>);
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
        width: 60,
        marginRight: 12,
        color: '#888888',
        textAlign: 'right',
    }
});
