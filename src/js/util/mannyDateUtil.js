'use strict';

class MannyDateUtil{
    /**
     * 构造函数
     */
    constructor(){
        // console.log('hhhh')
    }

    /**
     * 格式化数字: 数字num用length长度返回，默认长度是2。如num=2，length=7，则返回结果是0000002
     * @param num 需要格式化的数字
     * @param length 格式化后数字的长度
     * @returns {*} 字符串
     */
    formatNumber(num, length) {
        if(this.isEmpty(length)){
            length = 2 //默认长度为2
        }
        if(Object.is(parseInt(length),NaN)){
            throw new Error('第二个参数必须是数字')
        }else{
            // 数字
            if(length <= 0){
                throw new Error('第二个参数必须是大于0的整数')
            }else {
                if(num.toString().length == length){
                    return num
                }

                let maxNum = Math.pow(10,length);
                if(num < maxNum-1){
                    num = '0'.repeat(length-1) + num;
                }
            }
        }
        return num;
    }

    /**
     * 判断是否为空
     * @param obj
     * @returns {boolean}
     */
    isEmpty(obj){
        if (obj === null || obj === undefined || obj === '') {
            return true;
        }
        return false;
    }

    /**
     * 判断是否是整数数字 包含正整数，负整数，0
     * @param numStr
     */
    isNumber(numStr){
        let reg = new RegExp('-?[0-9]\\d*')
        return reg.test(numStr)
    }

    /***
     * 格式化日期，返回三种格式的日期，否则返回原日期
     * @param date Date对象
     * @param str yyyy-mm-dd yyyy/mm/dd yyyy年mm月dd日
     * @param flag 是否含时分秒
     * @returns {*}
     */
    formatDateToString(date, patternStr, flag){
        let result = date

        if(date.constructor.name != 'Date'){
            return result
        }

        if(this.isEmpty(patternStr)){
            patternStr = 'yyyy-mm-dd'; //默认格式
        }

        if(patternStr.constructor.name === 'String') {
            patternStr = patternStr.toLowerCase()
            //可格式化的格式列表
            let patternArr = ['yyyy-mm-dd','yyyy/mm/dd','yyyy年mm月dd日'];
            if(patternArr.includes(patternStr)){
                let year = date.getFullYear();
                let month = this.formatNumber(date.getMonth()+1);
                let day = this.formatNumber(date.getDate());
                let hour = this.formatNumber(date.getHours());
                let minute = this.formatNumber(date.getMinutes());
                let second = this.formatNumber(date.getSeconds());

                if(patternStr.includes('-')){
                    result = year + '-' + month + '-' + day
                }else if(patternStr.includes('/')){
                    result = year + '/' + month + '/' + day
                }else if(patternStr.includes('年') && patternStr.includes('月') && patternStr.includes('日')){
                    result = year + '年' + month + '月' + day + '日'
                }

                if(flag){
                    result = result + ' ' + hour + ':' + minute + ':' + second
                }
            }else {
                return result
            }
        }
        return result
    }

    /**
     * 字符串转换为Date对象，仅支持yyyy-mm-dd和yyyy/mm/dd两种格式的字符串，否则返回原字符串
     * @param dateStr 需要转换的日期字符串
     * @returns {*}
     */
    formatStringToDate(dateStr){
        if(dateStr.constructor.name != 'String'){
            return dateStr
        }
        let reg1 = new RegExp('[1-9][0-9]{3}-[0-9]{2}-[0-9]{2}')//2019-09-04
        let reg2 = new RegExp('[1-9][0-9]{3}/[0-9]{2}/[0-9]{2}')//2019/09/04

        let splitStr = ''
        if(reg1.test(dateStr)){
            splitStr = '-'
        }
        if(reg2.test(dateStr)){
            splitStr = '/'
        }

        if(splitStr.length == 0){
            return dateStr
        }

        let _date = dateStr.split(splitStr);
        let _year = 0,
            _month = 0,
            _day = 0;
        if(_date.length > 2){
            _year = parseInt(_date[0]);
            _month = parseInt(_date[1]) - 1;
            _day = parseInt(_date[2]);
        }else{
            return dateStr;
        }
        return new Date(_year, _month, _day);
    }

    /**
     * 获取当前日期的前/后n天的日期，返回Date类型
     * @param currentDay 可以是Date类型和String类型，String类型格式有要求：yyyy-mm-dd或者yyyy/mm/dd
     * @param n 正数为后，负数为前，0不变
     * @returns {Date}
     */
    getCountDay(currentDay,n) {
        if(this.isNumber(n)){
            n = parseInt(n)
        }else {
            return currentDay
        }

        let currentDate;
        if(currentDay.constructor.name === 'String'){
            currentDate = this.formatStringToDate(currentDay);
        }else if(currentDay.constructor.name === 'Date'){
            currentDate = currentDay
        }
        let result = currentDate.getTime() + n*24*60*60*1000;
        return new Date(result);
    }

    /**
     * 比较两个日期，仅比较到日期，不含时分秒。支持string格式 yyyy-mm-dd和date类型参数
     * @param dateStr1
     * @param dateStr2
     * @returns {number} 0:两个日期相等;1:dateStr1>dateStr2; -1:dateStr1<dateStr2
     */
    compareDate(dateStr1,dateStr2) {
        var date1,date2;
        if(typeof dateStr1 == 'string'){
            //字符串类型
            date1 = this.formatStringToDate(dateStr1);
        }else if(typeof dateStr1 == 'object' && dateStr1 instanceof Date){
            //date类型
            date1 = this.formatStringToDate(this.formatDateToString(dateStr1));
        }
        if(typeof dateStr2 == 'string'){
            //字符串类型
            date2 = this.formatStringToDate(dateStr2);
        }else if(typeof dateStr2 == 'object' && dateStr2 instanceof Date){
            //date类型
            date2 = this.formatStringToDate(this.formatDateToString(dateStr2));
        }

        var tempTime1,tempTime2;
        tempTime1 = date1.getTime();
        tempTime2 = date2.getTime();

        if(tempTime1 == tempTime2){
            return 0;
        }else if(tempTime1 > tempTime2){
            return 1;
        }else if(tempTime1 < tempTime2){
            return -1;
        }
    }
}