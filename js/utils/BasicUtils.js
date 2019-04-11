import React from 'react';

export default class BasicUtils {
    static jsonSort(array, field, reverse) {
        //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
        if (array.length < 2 || !field || typeof array[0] !== "object")
            return array;

        //数字类型排序
        if (typeof array[0][field] === "number") {
            array.sort(function(x, y) {
                return x[field] - y[field]
            });
        }
        //字符串类型排序
        if (typeof array[0][field] === "string") {
            array.sort(function(x, y) {
                return x[field].localeCompare(y[field])
            });
        }
        //倒序
        if (reverse) {
            array.reverse();
        }
        return array;
    }
}
