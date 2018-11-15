import React from 'react';
import {AsyncStorage} from 'react-native';

export default class StorageUtil {
    // static async set(key, value, callback) {
    //     // return AsyncStorage.setItem(key, JSON.stringify(value), callback)
    //     try {
    //         return await AsyncStorage.setItem(key, JSON.stringify(value), callback);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    static set(key, value, callback) {
        return AsyncStorage.setItem(key, JSON.stringify(value), callback)
    }
    static async get(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                console.log(value);
                return JSON.parse(value)
            }
        } catch (error) {
            console.error(error);
        }
    }
    // static get(key) {
    //     return new Promise((resolve, reject) => {
    //         AsyncStorage.getItem(key, (error, result) => {
    //             if (!error) {
    //                 try {
    //                     resolve(JSON.parse(result));
    //                 } catch (e) {
    //                     reject(error);
    //                 }
    //             } else {
    //                 reject(error);
    //             }
    //         })
    //     })
    // }

    static remove(key, callback) {
        return AsyncStorage.removeItem(key, callback)
    }

    static update(key, value) {
        StorageUtil.get(key).then((item) => {
            value = typeof value === 'string'
                ? value
                : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value), callback);
        })
    }
}
